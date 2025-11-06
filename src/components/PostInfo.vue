<template>
    <div class="post-info-wrapper">
        <div class="post-info-content">
            <div class="post-date">{{ post.date }}</div>
            <div class="post-title">{{ post.title }}</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: {
        post: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>
.post-info-content {
    display: flex;
    width: 100%;
    gap: 20px;
}

.post-info-wrapper {
    width: 100%;
}

.post-date {
    color: var(--cool-gray);
}
</style>