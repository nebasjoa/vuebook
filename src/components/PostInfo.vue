<template>
    <router-link :to="{ name: 'BlogPost', params: { slug: post.slug } }">
    <div class="post-info-wrapper">
        <div class="post-info-content">
            <span v-if="post.date" class="post-date">{{ post.date }}</span>
            <span class="post-title">{{ post.title }}</span>
            <span v-if="post.category" class="post-meta">{{ post.category }}</span>
            <span v-if="post.author" class="post-meta">{{ post.author }}</span>
        </div>
    </div>
    </router-link>
</template>

<script>
export default {
    props: {
        post: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>
a {
    text-decoration: none;
    color: white;
    cursor: pointer;
}
.post-info-content {
    display: flex;
    width: 100%;
    gap: 14px;
    align-items: baseline;
    flex-wrap: wrap;
}

.post-info-wrapper {
    width: 100%;
}

.post-date {
    color: var(--cool-gray);
}

.post-title {
    font-weight: 600;
    line-height: 1.25;
}

.post-meta {
    color: var(--cool-gray);
}
</style>
