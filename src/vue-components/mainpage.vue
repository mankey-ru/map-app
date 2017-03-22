<script>
	var apiUrl = require('./../api-url.js').def;
	// try https://www.npmjs.com/package/vue-material-datepicker
	import Datepicker from 'vuejs-datepicker'
	import _ from 'lodash'
	import mixins from './../vue-mixins.js'
	import mapLib from './../map-lib.js'
	import request from 'superagent'
	import miniToastr from 'mini-toastr'

	var _vm;
	var map;

	export default {
		name: 'start',
		data: function () {
			return {
				search: {
					date: null,
					text: ''
				},
				map_pending: true,
				datepicker_visible: false,
				sidebar_visible: false,
				genres_visible: false,
				genres: [],
				evtList: [],
				evtHiddenQty: 0
			}
		},
		computed: {
		},
		methods: {
			showAll: function(){
				for (var i=0, len=this.$data.evtList.length; i<len; i++) {
					this.$data.evtList[i].mark.setVisible(true)
					this.evtHiddenQty = 0;
					this.genres_checkAll(1);
				}
			},
			genres_check: function(gen){
				gen.selected = !gen.selected;			
				var selected_ids = this.$data.genres
				.filter(function(_gen){
					return _gen.selected===true
				})
				.map(function(_gen){
					return _gen._id
				})
				var hiddenQty = 0;
				for (var i=0, len=this.$data.evtList.length; i<len; i++) {
					var evt = this.$data.evtList[i];
					var evtMatch = selected_ids.indexOf(evt.genre_id) !== -1;
					evt.mark.setVisible(evtMatch)
					if (evtMatch===false) {
						hiddenQty++
					}
				}
				this.evtHiddenQty = hiddenQty;

			},
			genres_checkAll: function (boo) {
				boo = !!boo;
				for (let gen of this.genres) {
					gen.selected = !!boo;
				}
			},
			evtSearch: function () {
				alert(JSON.stringify(this.$data.search, null, 2))
			}
		},
		mixins: [mixins],
		components: {
			Datepicker
		},
		mounted: function () {
			_vm = this;
			/**
				Handling genre list
				*/
			// If store have genres right now, they are copied to $data right now
			if (this.$store.state.genreList) {
				setGenres(this.$store.state.genreList)
			}
			// Otherwise it happens after store mutation
			else {
				this.$store.subscribe(function(mutation, state){
					if (mutation.type==='m_loadCommonData') {
						setGenres(state.genreList)
					}
				})
			}
			function setGenres(state_genreList) {
				var mapped = state_genreList.map((v) => {
					_vm.$set(v, 'selected', true)
					return v
				});
				_vm.$data.genres = mapped;
			}
			/**
				Handling sidebar behavior
				*/
				var sidebar = document.querySelector('.side-wrap');
				document.body.addEventListener('click', (evt)=>{
					if (this.sidebar_visible===true && sidebar.contains(evt.target)===false) {
						this.sidebar_visible = false;
					} 
				})
				if (window.cordova) {
					var backPressedOnce = false;
					document.addEventListener('backbutton', (evt) => {
						if (this.sidebar_visible === true) {
							evt.preventDefault();
							this.sidebar_visible = false;
						}
						else {
							if (backPressedOnce === true) {
								navigator.app.exitApp();
							}
							else {
								backPressedOnce = true;
								setTimeout(() => {
									backPressedOnce = false
								}, 1000)
							}
						}
					}, false);
				}
				else {
					document.body.addEventListener('keyup', (evt)=>{
						if (evt.keyCode===27) {
							this.sidebar_visible = false;
						}
					})
				}
			/**
				Creating map
				*/
				mapLib.create((createdMap)=>{
					this.map_pending = false;
					map = createdMap;

					request
					.get(apiUrl + 'events')
					.end((err,res)=>{
						if (err) {
							miniToastr.error(err || 'Failed to get events')
						}
						else {
							if (res.body instanceof Array) {
								for (let evt of res.body) {
									var mark = new google.maps.Marker({
										position: {
											lat: evt.latLng[0], 
											lng: evt.latLng[1]
										},
										map: map,
										icon: 'pin.svg',
									//animation: google.maps.Animation.DROP
								})
									mark.addListener('click', ()=>{showEvtInfo(evt)});		
									evt.mark = mark;
									this.evtList.push(evt);
								}
							}
						}
					})

				});
			}
		}
		var infowindow;
		function showEvtInfo(evt){
			if (infowindow) {
				infowindow.close();
			}
			infowindow = new google.maps.InfoWindow({
				content: `
				<h3>${evt.name}</h3>
				<pre>${evt.descr}</pre>
				<div class="text-right">
					<a class="btn btn-info" href="#/event/card/${evt._id}">Подробнее</a>
				</div>`
			});
			infowindow.open(map, evt.mark);
		}
	</script>

	<template>
		<!-- TODO use https://www.npmjs.com/package/v-media-query instead of bootstrap media queries like visible-xs -->
		<div>
			<div v-show="map_pending" class="text-center">
				<i class="spin spin-lg spin-global"></i>
			</div>

			<div v-show="!map_pending">
				<div class="hdn">
					<!-- positions explained: https://google-developers.appspot.com/maps/documentation/javascript/examples/full/control-positioning-labels -->
					<div data-pos="TOP" class="j-mapctrl" style="width: 100%; ">

						<div class="side-wrap" v-bind:class="sidebar_visible?'side-wrap-visible':''">
							<div class="side-content">
								<h1 class="text-center">Меню</h1>
								<br/><br/>
								<div v-if="!currentUser">
									<a v-on:click="GOTO_LOGIN" class="btn btn-block btn-primary btn-lg">
										Вход
									</a>
									<a v-on:click="GOTO_REGISTER" class="btn btn-block btn-default btn-lg">
										Регистрация
									</a>
								</div>
								<div v-if="currentUser">
									<a v-on:click="GOTO_PROFILE" class="btn btn-block btn-primary btn-lg">
										Профиль
									</a>
									<a v-on:click="LOG_OUT" class="btn btn-block btn-default btn-lg">
										Выход
									</a>

									<hr />
									<a v-on:click="GOTO_EVT_NEW" class="btn btn-block btn-default btn-lg">
										Создать мероприятие
									</a>
									<a v-on:click="GOTO_PROFILE" class="btn btn-block btn-default btn-lg">
										Мои мероприятия
									</a>
								</div>
								<hr />
								<a v-on:click="GOTO_REGISTER" class="btn btn-block btn-default btn-lg">
									Как это работает
								</a>
								<a v-on:click="GOTO_REGISTER" class="btn btn-block btn-default btn-lg">
									О нас
								</a>
							</div>
						</div>
						<div class="map-ctrl-wrap">
							<div class="row">
								<div class="col-md-18 col-sm-8 col-xs-4">
									<form v-on:submit.prevent="evtSearch">
										<div class="map-pane-main">
											<i v-on:click.stop="sidebar_visible = !sidebar_visible" class="glyphicon glyphicon-menu-hamburger" ></i>
											<span class="hamburger-box">
												<span class="hamburger-inner"></span>
											</span></a>
											<span class="hidden-xs hidden-sm">
												<input v-model="search.text" />
												<i class="glyphicon glyphicon-search" v-on:click="evtSearch"></i>
												<i class="glyphicon glyphicon-tasks"></i>
											</span>
										</div>
										<div class="map-pane__wrap hidden-xs hidden-sm">
											<span class="">
												<div class="map-pane__content map-pane-date" v-on:click="datepicker_visible = !datepicker_visible">
													<span>{{search.date | dateFormatPretty}}</span> 
													<i class="glyphicon glyphicon-calendar"></i>
												</div>
											</span>
											<div class="map-pane__content" v-show="datepicker_visible">
												<div class="row">
													<div class="col-xs-20">
														<a v-on:click="search.date = null" class="btn btn-block btn-default">
															Любая дата
														</a>
													</div>
													<div class="col-xs-4 text-right">
														<i v-on:click="datepicker_visible = false" class="glyphicon glyphicon-remove-circle pntr"></i>
													</div>
												</div>
												<!-- календарь для десктопов -->
												<div class="__datepicker-wrap __datepicker-wrap-noborder __datepicker-wrap-center">
													<datepicker 
													:input-class="'form-control'" 
													v-model="search.date"
													:language="'ru'"
													:monday-first="true"
													:format="'dd.MM.yyyy'"
													:inline="true"
													></datepicker>
												</div>
											</div>
										</div>
									</form>
								</div>
								<div class="col-md-6 col-sm-16 col-xs-20">
									<div class="text-right">
										<!-- календарь для мобил -->
										<div class="visible-xs visible-sm">
											<div>
												
												<div style="margin-top:.5em;float:left;"v-show="datepicker_visible" class="__datepicker-wrap __datepicker-wrap-noborder __datepicker-wrap-center">
													<datepicker 
													:input-class="'form-control'" 
													v-model="search.date"
													:language="'ru'"
													:monday-first="true"
													:format="'dd.MM.yyyy'"
													:inline="true"
													></datepicker>
												</div>
												<a class="btn btn-default btn-lg btn-map-standalone"
												v-on:click="datepicker_visible = !datepicker_visible"><i class="glyphicon glyphicon-calendar"></i></a>
											</div>
											<br/>
											<div>
												<a class="btn btn-default btn-lg btn-map-standalone">
													<i class="glyphicon glyphicon-search" v-on:click="evtSearch"></i>
												</a>
											</div>
										</div>
										<div class="hidden-xs hidden-sm">
											<i v-if="currentUser"  v-on:click.prevent="GOTO_PROFILE" class="glyphicon glyphicon-user map-profile-icon"></i>
											<div v-if="!currentUser">
												<a class="btn btn-default btn-map-standalone" v-on:click="GOTO_LOGIN">
													Вход
												</a> &#160;
												<a class="btn btn-default btn-map-standalone" v-on:click="GOTO_REGISTER">
													Регистрация
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div data-pos="LEFT_BOTTOM" class="j-mapctrl genre-wrap">

						<div v-if="currentUser" class="row">
							<div class="col-md-10 col-xs-24">
								<div v-show="evtHiddenQty!==0" class="map-pane__content">
									<div class="row">
										<div class="col-xs-12">
											Скрыто {{evtHiddenQty}} из {{evtList.length}}.
										</div>
										<div class="col-xs-12 text-right">
											<a class="link-dotted" v-on:click="showAll">Показать все</a>
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-14 col-xs-24 text-right">
								<a class="btn btn-warning btn-lg hidden-sm btn-map-newevt" 
								v-if="currentUser.role"
								v-on:click="GOTO_EVT_NEW">Создать мероприятие</a>
								<a class="btn btn-warning visible-sm-inline-block btn-material"
								v-if="currentUser.role" 
								v-on:click="GOTO_EVT_NEW">+</a>
							</div>
						</div>

						<div v-show="!genres_visible" class="text-center">
							<a class="btn btn-lg btn-info genre-teaser" v-on:click="genres_visible = !genres_visible">
								Фильтр по жанрам
							</a>
						</div>
						<div v-show="genres_visible" class="genre-list-wrap map-pane__content">
							<div class="row form-group">
								<div class="col-xs-20">
									<a v-on:click="genres_checkAll(1)" class="link-dotted">
										Все
									</a> 
									&#160;
									<a v-on:click="genres_checkAll(0)" class="link-dotted">
										Ничего
									</a>
								</div>
								<div class="col-xs-4 text-right">
									<i v-on:click="genres_visible = !genres_visible" class="glyphicon glyphicon-remove-circle pntr"></i>
								</div>
							</div>
							<div>
								<label 
								v-for="gen in genres" 
								class="genre btn" 
								v-bind:class="gen.selected?'btn-primary':'btn-default'" 
								v-on:click="genres_check(gen)"><span>{{gen.name}}</span></label>
							</div>
						</div>
					</div>
				<!-- <div data-pos="RIGHT_BOTTOM" class="j-mapctrl map-ctrl-wrap">
					<input id="map-ctrl-search" class="form-control" style="width: 20em" placeholder="Поиск мест" />
				</div> -->
			</div>
		</div>
		<div id="map-container" class="__fullscreen" v-bind:class="sidebar_visible?'map-when-sidebar':''"></div>
	</div>

</div>
</template>

<style scoped lang="less">
	.-boxshad {
		box-shadow: #000 1px 2px 4px 0px;
	}
	.-map-pane-fontsize {
		font-size: 2.4em;
	}
	.map-profile-icon {
		font-size:4em;
		margin-right:.5em;
		cursor: pointer;
		border-radius: 11em;
		border: 2px solid;
		width: 1.7em;
		height: 1.7em;
		line-height: 1.7em;
		text-align: center;
		&:hover{
			box-shadow: #000 0 0 8px 0px;
		}
	}
	.btn-map-newevt {
		margin-right:1em;
		margin-bottom:1em;
		.btn-map-standalone();
	}
	.btn-map-standalone {
		.-boxshad();
		.-map-pane-fontsize();
		border: none;
	}
	.hamburger {
		padding: 0;
	}
	.side-wrap {
		margin-left:-250px;
		position: fixed;
		height: 100vh;
		width: 250px;
		overflow: hidden;
		background-color: #fff;
		transition: transform .2s ease-in-out;
		transform: translateX(0);
	}
	.side-wrap-visible {
		transform: translateX(250px);
		box-shadow: rgba(0,0,0,0.8) 0px 0px 0px 9999px;
		//transition: width .2s ease-in-out;
		//display: block; 
	}
	.side-content {
		padding: 1em;
	}
	.map-pane__wrap {
		float:left;
	}
	.map-pane__content {
		.-boxshad();
		.-map-pane-fontsize();
		border-radius: 3px;
		background: #fff;
		padding: .4em .6em;
	}
	.map-pane-date {
		cursor:pointer;
		display: inline-block;
		margin-bottom: .5em;
	}
	.map-pane-main {
		.map-pane__wrap();
		.map-pane__content();
		margin-right: .5em;
		input{
			margin-left: 1em;
			border: none;
			width:15em;
		}
		input:focus{
			outline: 0;
		}
		.glyphicon{
			cursor: pointer;
		}
		.glyphicon-search{
			padding-right: .5em;
			border-right: 1px solid #bdbdbd;
			margin-right: .3em;
		}
	}
	.genre {
		font-size: 1em;
		margin-top: .1em;
		margin-right: 1em;
		font-weight: normal;
		&>input {
			display: none;
		}
	}
	.genre-list-wrap {
		padding: .5em;
		//margin-bottom: 1em;
	}
	.genre-wrap { // лапоть внизу
		width: 100%;
		padding-left: 2em;
		padding-right: 2em;
	}
</style>