<template>
    <div class="footer-wrapper">
        <div class="footer-content">
            <div class="footer-subgroup">
                <h3>nebasjoa</h3>
                <p>2025 nebasjoa</p>
            </div>
            <div class="footer-subgroup">
                <h3>Socials</h3>
                <ul>
                    <li><a href="https://instagram.com/nebasjoa" target="_blank">Instagram</a></li>
                    <li><a href="https://www.linkedin.com/in/nebojsapesic/" target="_blank">Linkedin</a></li>
                    <li><a href="https://github.com/nebasjoa" target="_blank">Github</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script></script>

<style scoped>
.footer-wrapper {
    width: 100%;
    display: flex;
    margin: auto;
    background-color: var(--charcoal);
    color: white;
    height: 10vh;
}

.footer-content {
    width: 100%;
    max-width: var(--main-width);
    margin: auto;
    display: flex;
    justify-content: space-between;
}

.footer-subgroup ul {
    display: flex;
    margin-left: 0;
    padding-left: 0;
    gap: 10px;
}

.footer-subgroup li {
    list-style-type: none;
    margin-left: 0;
}

.footer-subgroup a {
    color: white;
    text-decoration: none;
    cursor: pointer;
}
</style>