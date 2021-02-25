<template>
  	<b-icon icon="arrow-left" style="position: absolute; top: 5px; left: 5px; font-size: 33px;" class="h4 text-danger"
			@click="goBack()"></b-icon>
</template>

<script>
export default {
    methods:{
        goBack(){
            this.$router.push("/");
        }
    }
}
</script>

<style>

</style>