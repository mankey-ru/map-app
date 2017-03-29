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
		name: 'MainPage',
		data: function () {
			return {
				search: {
					date: '',
					text: ''
				},
				map_pending: true,
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
				this.$store.subscribe(function (mutation, state) {
					if (mutation.type === 'm_loadCommonData') {
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
				Creating map
				*/
				mapLib.create((createdMap) => {
					this.map_pending = false;
					map = createdMap;

					request
					.get(apiUrl + 'events')
					.end((err, res) => {
						if (err) {
							miniToastr.error(err || 'Failed to get events')
						}
						else {
							if (res.body.evtList instanceof Array) {
								for (let evt of res.body.evtList) {
									var mark = new google.maps.Marker({
										position: {
											lat: evt.latLng[0],
											lng: evt.latLng[1]
										},
										map: map,
										icon: 'pin.svg',
										//animation: google.maps.Animation.DROP
									})
									mark.addListener('click', () => {
										showEvtInfo(evt)
									});
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
			<q-modal ref="modal_date" position="top">
				<div class="generic-margin">
					<div>
						<q-inline-datetime v-model="search.date" type="date"></q-inline-datetime>
					</div>
					<div class="text-right">
						<button v-on:click.prevent="search.date = ''" class="tertiary">
							Любая дата
						</button>
						<button v-on:click="$refs.modal_date.close()" class="tertiary">
							Отмена
						</button>
					</div>
				</div>
			</q-modal>
			<q-modal ref="modal_genres" position="bottom">
				<div class="generic-margin">
					<div class="row generic-margin">
						<div class="width-3of4">
							<button v-on:click="genres_checkAll(1)" class="light">
								Всё
							</button> 
							&#160;
							<button v-on:click="genres_checkAll(0)" class="light">
								Ничего
							</button>
						</div>
						<div class="width-1of4 text-right">
							<button v-on:click="$refs.modal_genres.close()" class="clear">
								Отмена
							</button>
						</div>
					</div>
					<div class="group">
						<span v-for="gen in genres" class="chip label cursor-pointer" v-bind:class="gen.selected?'bg-orange':'bg-grey-4'" v-on:click="genres_check(gen)">
							{{gen.name}}
						</span>
					</div>
				</div>
			</q-modal>
			<div v-show="map_pending" class="text-center">
				<i class="spin spin-lg spin-global"></i>
			</div>

			<div v-show="!map_pending">
				<div v-if="currentUser && currentUser.role" >
					<div class="newEvtWrap absolute-bottom-right">
						<button class="gt-sm glossy orange round big" v-on:click="GOTO_EVT_NEW">
							Создать мероприятие
						</button>
						<button class="lt-md glossy orange circular big" v-on:click="GOTO_EVT_NEW">
							<i>add</i>
						</button>
					</div>
				</div>
				<div class="hdn">
					<!-- positions explained: https://google-developers.appspot.com/maps/documentation/javascript/examples/full/control-positioning-labels -->
					<div data-pos="TOP" class="j-mapctrl" style="width: 100%; ">
						<div class="map-ctrl-wrap">
							<div class="row">
								<div class="width-2of3">
									<div class="map-pane-main row inline"><!-- hide-on-drawer-visible -->
										<i v-on:click="$parent.$refs.drawer_left.open()" class="mdi mdi-menu"></i>
										<form class="inline" v-on:submit.prevent="evtSearch">
											<span class="gt-sm">
												<input v-model="search.text" placeholder="Поиск" />
												<i class="glyphicon glyphicon-search" v-on:click="evtSearch"></i>
												<i class="glyphicon glyphicon-tasks"></i>
											</span>
										</form>
									</div>
									<div class="hidden-xs hidden-sm">
										<div class="map-pane__date">
											<div class="cursor-pointer" v-on:click="$refs.modal_date.open()">
												<span>{{search.date | dateFormatPretty}}</span> 
												<i class="mdi mdi-calendar"></i>
											</div>
										</div>
									</div>
									
								</div>
								<div class="width-1of3">
									<div class="text-right">
										<!-- Mobile -->
										<div class="lt-md">
											<div>
												<button class="primary push">
													<i class="mdi mdi-calendar"></i>
												</button>
											</div>
											<br/>
											<div>
												<button class="primary outline" v-on:click="evtSearch">
													<i class="mdi mdi-file-find"></i>
												</button>
											</div>
										</div>
										<!-- Desktop -->
										<div class="gt-sm text-right">
											<i v-if="currentUser"  v-on:click.prevent="GOTO_PROFILE" class="glyphicon glyphicon-user map-profile-icon"></i>
											<div v-if="!currentUser">
												<button class="primary push bg-white text-black big" v-on:click="GOTO_LOGIN">
													Вход
												</button> &#160;
												<button class="primary push bg-white text-black big" v-on:click="GOTO_REGISTER">
													Регистрация
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div data-pos="LEFT_BOTTOM" class="j-mapctrl genre-wrap">
						<div class="text-center">
							<span v-show="evtHiddenQty!==0">
								Скрыто {{evtHiddenQty}} из {{evtList.length}}. 
								<a class="link-dotted" v-on:click="showAll">Показать все</a>
							</span>
							<button class="orange push" v-on:click="$refs.modal_genres.open()">
								Фильтр по жанрам
							</button>
						</div>
					</div>
				<!-- <div data-pos="RIGHT_BOTTOM" class="j-mapctrl map-ctrl-wrap">
					<input id="map-ctrl-search" class="form-control" style="width: 20em" placeholder="Поиск мест" />
				</div> -->
			</div>
		</div>
		<div id="map-container" class="__fullscreen"></div>
	</div>

</div>
</template>

<style scoped lang="less">
	.newEvtWrap {
		margin: 3em;
		z-index: 29;
	}
	.-boxshad {
		box-shadow: #000 1px 2px 4px 0px;
	}
	.-map-pane-fontsize {
		font-size: 1.4em;
	}
	.map-profile-icon {
	}
	.map-pane__wrap {
		float:left;
	}
	.map-pane__date {
		.map-pane__content();
		display: inline-block;
	}
	.map-pane__content {
		.-boxshad();
		.-map-pane-fontsize();
		border-radius: 3px;
		background: #fff;
		padding: .3em .5em;
	}
	.map-pane-main {
		.map-pane__wrap();
		.map-pane__content();
		margin-right: .4em;
		input{
			margin-left: 1em;
			border: none;
			width:15em;
		}
	}
	.genre-wrap { // лапоть внизу
		width: 100%;
		padding-left: 2em;
		padding-right: 2em;
	}
</style>