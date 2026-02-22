<template>
    <div class="home-view-wrapper">
        <div class="home-view-content">
            <h2>My Portfolio</h2>
            <div class="home-view-section">
                <p>Latest writing from the blog, managed in Strapi and rendered here.</p>
            </div>

            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

            <div class="post-list-wrapper">
                <div class="post-list" v-for="post in posts" :key="post.id">
                    <PostInfo :post="post" />
                </div>
                <p v-if="!isLoading && posts.length === 0">No posts yet.</p>
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
        };
    },
    async created() {
        this.isLoading = true;
        this.errorMessage = '';
        try {
            this.posts = await fetchPosts(3);
        } catch (error) {
            this.posts = [];
            this.errorMessage = error.message || 'Failed to load posts.';
        } finally {
            this.isLoading = false;
        }
    },
    components: {
        PostInfo
    }
};
</script>

<style scoped>
.home-view-wrapper {
    width: 100%;
    background-color: var(--charcoal);
    color: white;
    display: flex;
    min-height: 85vh;
}

.home-view-content {
    width: 100%;
    max-width: var(--main-width);
    margin: auto;
    margin-top: 40px;
}

.home-view-section {
    margin-top: 30px;
}

.post-list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 30px;
}

.error-message {
    color: #ffb0b0;
    margin-top: 10px;
}
</style>
