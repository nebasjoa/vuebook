<template>
    <div class="navbar-wrapper">
        <div class="navbar-content">
            <div class="logo"></div>
            <div class="navbar-menu">
                <ul>
                    <li><router-link to="/">home</router-link></li>
                    <li>blog</li>
                    <li>about</li>
                    <li><router-link to="/cv">cv</router-link></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script></script>

<style scoped>
.navbar-wrapper {
    width: 100%;
    background-color: var(--charcoal);
    color: white;
    display: flex;
    margin: auto;
    min-height: 5vh;
}

.navbar-content {
    width: var(--main-width);
    display: flex;
    margin: auto;
}

.navbar-menu ul {
    display: flex;
    gap: 10px;
    padding: 0;
}

.navbar-menu li {
    list-style-type: none;
}

.navbar-menu li:hover {
    cursor: pointer;
}

.navbar-menu a {
    text-decoration: none;
    color: white;  
}
</style>
