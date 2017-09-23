import request from 'superagent';
var apiUrl = require('./../api-url.js').def;

export default {
	methods: {
		fetchGenres: function(bPrepareForQDialog) {
			var _vm = this;
			request
				.get(apiUrl + 'genres')
				.end((err, res) => {
					this.search_pending = false;
					if (err) {
						Toast.create.negative('Ошибка запроса')
					}
					else {
						if (res.body && res.body.genreList instanceof Array) {
							for (var i = 0; i < res.body.genreList.length; i++) {
								res.body.genreList[i].selected = true;
							}
							if (bPrepareForQDialog) {
								res.body.genreList = res.body.genreList.map(function(el) { // контрол ждёт такую структуру
									return {
										label: el.name,
										value: el._id
									}
								})
							}
							_vm.$data.genres = res.body.genreList;
						}
					}
				});
		}
	}
}