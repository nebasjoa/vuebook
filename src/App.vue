<script>
import Footer from './components/Footer.vue';
import Navbar from './components/Navbar.vue';

export default {
  data() {
    return {
      firstName: 'Nebojsa',
      lastName: 'Pesic',
    }
  },
  computed: {
    fullname() {
      return this.firstName + ' ' + this.lastName
    }
  },
  created() {
    
  },
  mounted() {
    
  },
  components: {
    Navbar,
    Footer
  }
}
</script>

<template>
  <Navbar />
  <router-view />
  <Footer />
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
</style>
