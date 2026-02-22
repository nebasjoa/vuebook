<template>
    <div class="blog-post-view-wrapper">
        <div class="blog-post-view-content">
            <section v-if="post">
                <h2>{{ post.title }}</h2>
                <p class="post-date">
                    <span v-if="post.date">{{ post.date }}</span>
                    <span v-if="post.category"> | kategorija: {{ post.category }}</span>
                    <span v-if="post.author"> | autor: {{ post.author }}</span>
                </p>
                <p v-if="post.description" class="post-description">{{ post.description }}</p>
                <img v-if="post.coverUrl" :src="post.coverUrl" :alt="post.title" class="post-cover" />
                <div v-html="renderedContent" class="prose"></div>
            </section>

            <section v-else-if="isLoading">
                <p>Loading post...</p>
            </section>

            <section v-else-if="errorMessage">
                <h1>Could not load post</h1>
                <p>{{ errorMessage }}</p>
                <router-link to="/blog">Back to blog</router-link>
            </section>

            <section v-else>
                <h1>Post not found</h1>
                <p>We couldn't find a post for "{{ $route.params.slug }}".</p>
                <router-link to="/blog">Back to blog</router-link>
            </section>
        </div>
    </div>
</template>

<script>
import { marked } from 'marked';
import { fetchPostBySlug } from '@/services/blogApi.js';

export default {
    name: 'BlogPostView',
    data() {
        return {
            post: null,
            isLoading: false,
            errorMessage: ''
        };
    },
    created() {
        this.loadPost();
    },
    watch: {
        '$route.params.slug': 'loadPost'
    },
    computed: {
        renderedContent() {
            return this.post ? marked(this.post.content || '') : '';
        }
    },
    methods: {
        async loadPost() {
            this.isLoading = true;
            this.errorMessage = '';
            try {
                this.post = await fetchPostBySlug(this.$route.params.slug);
            } catch (error) {
                this.post = null;
                this.errorMessage = error.message || 'Failed to load post.';
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>

<style scoped>
.blog-post-view-wrapper {
    min-height: 85vh;
    color: white;
    width: 100%;
    display: flex;
}

.blog-post-view-content {
    width: 100%;
    max-width: var(--main-width);
    margin: auto;
    margin-top: 40px;
}

.post-date {
    color: var(--cool-gray);
    margin-top: 10px;
}

.prose {
    margin-top: 30px;
}

.post-description {
    margin-top: 14px;
    color: rgba(255, 255, 255, 0.82);
    line-height: 1.5;
}

.post-cover {
    margin-top: 18px;
    width: 100%;
    max-height: 420px;
    object-fit: cover;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
