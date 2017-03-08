<script>
	import mixins from './../vue-mixins.js';
	export default {
		name: 'start',
		data: function () {
			return {
			}
		},
		mounted: function () {
			this.$router.push({name: 'map-google'})
		}
	}
</script>

<template>
	<div>
	</div>
</template>

<style>
</style>
