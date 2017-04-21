<script>
	/**
	List Item Link
	Simple replacement for DrawerLink.vue from Quasar Framework
	with non-ligature based icons from https://www.npmjs.com/package/mdi
	*/
	export default {
		props: {
			icon: String,
			to: [Object, String],
			act: [Function],
			drawer: [Object],
			drawer_mode: {
				type: String,
				default: 'INSTANT'
			}
		},
		methods: {
			_GOTO: function(){
				var vm = this.$router;
				if (!this.act && !this.to) {
					console.error('List Item Link: required props (act|to) not provided')
					return
				}
				var toObj = {name: this.to};
				var action = this.act || function(){
					vm.push(toObj)
				};
				var drawer = this.drawer; //  || this.$parent.$refs.drawer_left
				if (drawer) {
					// if drawer is provided we have three ways to deal with it:

					// a) close it immediately (WITHOUT animation) and perform an action
					if (this.drawer_mode === 'INSTANT') {
						if (drawer.active === true) {
							// now its the only way to avoid animation
							drawer.active = false;
							drawer.opened = false;
							drawer.backPosition = 0;
							drawer.nodePosition = -280;
						}
						action();
					}

					// b) close it normally (WITH animation), THEN WHEN ITS DONE perform an action
					else if (this.drawer_mode === 'AFTERCLOSE') {
						drawer.setState(false, action);
					}

					// c) close it normally (WITH animation), AND perform an action
					else {
						drawer.setState(false);						
						action();
					}
				}
				else {
					action();
				}
			}
		},
		computed: {
			isCurrent: function(){
				return this.$route.name === this.to
			}	
		}
	};
</script>

<template>
	<div class="item item-link" v-bind:class="{'active':isCurrent}" v-on:click="_GOTO">
		<i v-if="icon" class="item-primary mdi" v-bind:class="'mdi-'+icon"></i>
		<div class="item-content"> 
			<slot></slot>
		</div>
	</div>
</template>

<style scoped>
</style>
