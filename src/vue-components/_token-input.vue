<script>
	export default {
		name: 'token-input-component',
		props: {
			tags: {
				type: Array,
				default: () => [],
			},
			placeholder: {
				type: String,
				default: '',
			},
			onChange: {
				type: Function,
			},
			readOnly: {
				type: Boolean,
				default: false,
			},
			validate: {
				type: String,
				default: '',
			},
		},
		data() {
			return {
				newTag: '',
			};
		},
		methods: {
			focusNewTag() {
				if (this.readOnly) { return; }
				this.$el.querySelector('.new-tag').focus();
			},
			addNew(tag) {
				if (tag && !this.tags.includes(tag)) {
					this.tags.push(tag);
					this.tagChange();
				}
				this.newTag = '';
			},
			remove(index) {
				this.tags.splice(index, 1);
				this.tagChange();
			},
			removeLastTag() {
				if (this.newTag) { return; }
				this.tags.pop();
				this.tagChange();
			},
			getPlaceholder() {
				if (!this.tags.length) {
					return this.placeholder;
				}
				return '';
			},
			tagChange() {
				if (this.onChange) {
					// avoid passing the observer
					this.onChange(JSON.parse(JSON.stringify(this.tags)));
				}
			},
		},
	};
</script>

<template>

	<div v-on:click="focusNewTag" v-bind:class="{'read-only': readOnly}" class="tok-wrap">
		<span v-for="(tag, index) in tags" class="label label-info tok-item">
			<span>{{ tag }}</span>
			<i v-if="!readOnly" v-on:click.prevent.stop="remove(index)" class="tok-remove glyphicon glyphicon-remove"></i>
		</span>
		<input 
		v-if="!readOnly" 
		v-bind:placeholder="getPlaceholder()" 
		v-model="newTag" 
		v-on:keydown.delete.stop="removeLastTag()" 
		v-on:keydown.enter.prevent.stop="addNew(newTag)" 
		class="new-tag" />
	</div>

</template>

<style>
	.tok-wrap {
		overflow: hidden;
    	padding-left: .5em;
    	padding-top: .4em;
		cursor: text;
		-webkit-appearance: textfield;
	}
	.tok-item {
		margin-right: .5em;
		font-weight: normal; /* override for bootstrap's .label */
	}
	.tok-remove {
		cursor: pointer;
		margin-left: .5em;
	}
	.tok-wrap .new-tag {
		background: transparent;
		border: 0;
		color: #777;
		font-size: 13px;
		font-weight: 400;
		margin-bottom: 6px;
		margin-top: 1px;
		outline: none;
		padding: 4px;
		padding-left: 0;
		/*width: 80px;*/
	}

	.tok-wrap.read-only {
		cursor: default;
	}

	/*.tok-wrap .input-tag {
		background-color: #f0ad4e;
		border-radius: 2px;
		border: 1px solid #eea236;
		color: #fff;
		display: inline-block;
		font-size: 13px;
		font-weight: 400;
		margin-bottom: 4px;
		margin-right: 4px;
		padding: 3px;
	}*/

</style>
