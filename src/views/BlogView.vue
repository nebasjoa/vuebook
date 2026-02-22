<template>
    <div class="blog-view-wrapper">
        <div class="blog-view-content">
            <h2>My Blog</h2>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            <div class="post-list-wrapper">
                <div class="post-list" v-for="post in posts" :key="post.id">
                    <PostInfo :post="post" />
                </div>
                <p v-if="!isLoading && posts.length === 0">No posts yet.</p>
            </div>
            <div class="categories-wrapper">
                <h3>Kategorije</h3>
                <div class="categories">
                    <div v-for="category in categories" :key="category">
                        <router-link :to="{ name: 'Category', params: { category: category.toLowerCase() } }">{{ category }}</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PostInfo from '@/components/PostInfo.vue';
import { fetchPosts } from '@/services/blogApi.js';

export default {
    data() {
        return {
            posts: [],
            isLoading: false,
            errorMessage: ''
        }
    },
    async created() {
        this.isLoading = true;
        this.errorMessage = '';
        try {
            this.posts = await fetchPosts();
        } catch (error) {
            this.errorMessage = error.message || 'Failed to load posts.';
            this.posts = [];
        } finally {
            this.isLoading = false;
        }
    },
    computed: {
        categories() {
            const values = new Set();
            for (const post of this.posts) {
                if (!post.category) continue;
                const categories = String(post.category)
                    .split(',')
                    .map(c => c.trim())
                    .filter(Boolean);
                categories.forEach(c => values.add(c));
            }
            return Array.from(values);
        }
    },
    components: {
        PostInfo
    }
}
</script>

<style scoped>
.blog-view-wrapper {
    width: 100%;
    background-color: var(--charcoal);
    color: white;
    display: flex;
    min-height: 85vh;
}

.blog-view-content {
    width: 100%;
    max-width: var(--main-width);
    margin: auto;
    margin-top: 40px;
}

.post-list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 30px;
}

.categories-wrapper {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.categories {
    display: flex;
    gap: 15px;
    margin-top: 5px;
}

.categories a {
    text-decoration: none;
    color: white;
    cursor: pointer;
}

.error-message {
    color: #ffb0b0;
    margin-top: 10px;
}
</style>
