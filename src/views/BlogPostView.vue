<template>
    <div class="blog-post-view-wrapper">
        <div class="blog-post-view-content">
            <section class="" v-if="post">
                <h2>{{ post.title }}</h2>
                <p class="post-date">{{ post.date }}</p>
                <div v-html="renderedContent" class="prose"></div>
            </section>

            <section v-else>
                <h1>Post not found</h1>
                <p>We couldn't find a post for “{{ $route.params.slug }}”.</p>
                <router-link to="/blog">← Back to blog</router-link>
            </section>
        </div>
    </div>
</template>

<script>
import postsJson from '@/assets/files/posts.json';
import { marked } from 'marked';

export default {
    name: 'BlogPostView',
    data() {
        return { post: null };
    },
    created() {
        this.loadPost();
    },
    watch: {
        '$route.params.slug': 'loadPost'
    },
    computed: {
        renderedContent() {
            return this.post ? marked(this.post.content) : '';
        }
    },
    methods: {
        loadPost() {
            const { posts } = postsJson;
            const slug = this.$route.params.slug;

            // If duplicates exist, pick the most recent by date (dd.mm.yyyy)
            const matching = posts.filter(p => p.slug === slug);
            if (matching.length === 0) {
                this.post = null;
                return;
            }
            const toDate = s => {
                const [dd, mm, yyyy] = s.split('.');
                return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
            };
            this.post = matching.sort((a, b) => toDate(b.date) - toDate(a.date))[0];
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
</style>