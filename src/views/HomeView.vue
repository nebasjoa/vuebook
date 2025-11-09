<template>
    <div class="home-view-wrapper">
        <div class="home-view-content">
            <h2>My Portfolio</h2>
            <div class="home-view-section">
                <p>
                    Pošto sam ja organizator ovoga skuuupa, predajem reč drugu Bobanu. Prosto možete da čujete ovaj
                    video, zar ne.
                </p>
            </div>
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
    gap: 10px;
    margin-top: 30px;
}
</style>