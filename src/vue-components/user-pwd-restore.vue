<script>
	import mixins from './../vue-mixins/_global.js';
	export default {
		name: 'PlaceList',
		data: function () {
			return {
			}
		},
		mounted: function () {
			//this.$router.push({name: 'map-google'})
		}
	}
</script>

<template>
	<div>
		<h1>{{$route.meta.title}}</h1>
		<p>
			Sed tempor, neque eget gravida placerat, odio sapien dapibus nibh, non consequat mauris urna nec libero. Aliquam erat volutpat. Ut consequat turpis dolor, in molestie lacus aliquam sit amet. Quisque scelerisque, neque a posuere fermentum, ligula lectus ornare eros, sit amet bibendum ligula tortor sed lectus. 
		</p>
	</div>
</template>

<style>
</style>
