<template>
    <div class="blog-view-wrapper">
        <div class="blog-view-content">
            <h2>My Blog</h2>
            <div class="post-list-wrapper">
            <div class="post-list" v-for="post in posts" :key="post.id">
                <PostInfo :post="post" />
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import PostInfo from '@/components/PostInfo.vue';
import posts from '@/assets/files/posts.json'

export default {
    data() {
        return {
            posts: posts.posts
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
</style>