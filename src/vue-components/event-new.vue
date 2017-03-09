

<script>
	export default {
		name: 'forum-card',
		data: function () {
			return {
				title: 'Новое событие'
			}
		},
		methods: {
			create: function() {
				alert('Not implemented yet')
			}
		},
		mounted: function(){
		},
		destroyed: function () {
			'destroyed!'
		},		
		beforeUpdate: function() {},
		created: function(){}
	}
</script>

<template>
	<div class="row">
		<div class="col-xs-24 col-md-16 col-md-offset-4">
			<h2 class="form-group">{{title}}</h2>
			<hr />
			<div class="form-group">
				<label>Название</label>
				<input class="form-control" />
			</div>
			<div class="form-group">
				<label>Описание</label>
				<input class="form-control" />
			</div>
			<div class="form-group">
				<label>Коллектив</label>
				<select class="form-control">
					<option value="">Воровайки</option>
					<option value="">Битлз</option>
				</select>
			</div>
			<hr />
			<div class="row">
				<div class="col-xs-12">
					<a v-on:click="$router.push({name:'map-google'})" class="btn btn-default">
						<i class="glyphicon glyphicon-chevron-left"></i> 
						Вернуться
					</a>
				</div>
				<div class="col-xs-12 text-right">
					<a class="btn btn-success btn-lg">
						<i class="glyphicon glyphicon-ok"></i> 
						Создать
					</a>
				</div>
			</div>
		</div>

	</div>
</template>

<style>
</style>
