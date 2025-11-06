<template>
    <div class="login-view-wrapper">
        <div class="login-view-content">
            <form class="login-form">
                <div class="login-from-subgroup">
                    <label for="username">Username</label>
                    <input class="simple-input" type="text">
                </div>
                <div class="login-from-subgroup">
                    <label for="username">Password</label>
                    <input class="simple-input" type="password">
                </div>
                <div class="login-from-subgroup">
                    <button>Login</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script></script>

<style scoped>
.login-view-wrapper {
    width: 100%;
    display: flex;
    background-color: var(--charcoal);
    color: white
}

.login-view-content {
    width: var(--main-width);
    margin: auto;
    display: flex;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: auto;
}

.login-from-subgroup {
    display: flex;
    flex-direction: column;
}

.simple-input {
    border: none;
    border-bottom: 1px solid;
    border-color: white;
    background-color: var(--charcoal);
}
</style>