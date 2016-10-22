marked.setOptions({
  // renderer: new marked.Renderer(),
  gfm: true,
  // tables: true,
  breaks: true,
  // pedantic: false,
  // sanitize: true,
  // smartLists: true,
  // smartypants: false
});

var myMarked = {
	htmlElm: document.getElementById('html'),
	mdElm: document.getElementById('md'),
	catElm: document.getElementById('catelog'),
	catHandlerElm: document.getElementById('catelog-handler'),
	init: function() {
		this.bind();
		this.reStore();
		this.convert();
		this.mdElm.style.visibility = 'visible';
	},
	bind: function() {
		var self = this;
		self.mdElm.addEventListener('keyup', self.convert);
		self.mdElm.addEventListener('paste', function() {
			setTimeout(self.convert, 0);
		});
		self.catHandlerElm.addEventListener('click', self.toggleCatelog)
		window.addEventListener('beforeunload', function() {
			self.history('leave');
		});
	},
	toggleCatelog: function() {
		var elm = myMarked.catElm;
		if (getComputedStyle(elm).display === 'none') {
			elm.style.display = 'block';
		} else {
			elm.style.display = 'none';
		}
	},
	catelog: function() {
		var elms = document.querySelectorAll('#html h1,#html h2,#html h3,#html h4,#html h5,#html h6');
        var mleft = [];
        mleft['h1'] = 0;
        for (var i = 2; i <= 6; i++) {
            count = document.querySelectorAll('#html h' + (i - 1)).length > 0 ? 1 : 0;
            mleft['h' + i] = parseInt(mleft['h' + (i - 1)]) + count;
        }
        console.log(mleft);
		var htm = '', tag, text, id, h;
		for (var i=0, len = elms.length; i< len; i++) {
			h = elms[i];
			tag = h.tagName.toLowerCase();
			text = h.innerText;
			id = h.id;
			htm += '<li class="mleft'+mleft[tag]+'"><a  href="#'+id+'">'+text+'</a></li>';
		}
		myMarked.catElm.innerHTML =  htm ;
	},
	convert: function() {
		var value = myMarked.mdElm.value;
		myMarked.htmlElm.innerHTML = marked(value);
		hljs.initHighlighting.called = false;
		hljs.initHighlighting();

		myMarked.catelog();
	},
	reStore: function() {
		 if (!localStorage.history) {
		 	return false;
		 }
		 var history = myMarked.history();
		 var content = history[history.length - 1]['content'];
		 if (content === '') {
		 		return false;
		 }
		 myMarked.mdElm.value = content;
	},
	history: function(type) {
		if (!localStorage.history) {
			localStorage.history = "[]";
		}
		var history = JSON.parse(localStorage.history);

		if (arguments.length === 0) {
			// read
			return history;
		} else {
			// set
			history.push( {
				'date': new Date().getTime(),
				'type': type,
				'content': myMarked.mdElm.value
			});
			localStorage.history = JSON.stringify(history);
		}
	}
}
var colorScheme = {
	selectElem: document.getElementById('colorSchemeSelect'),
	styleElem: document.getElementById('colorSchemeStyle'),
	init: function() {
		this.bind();
		this.storage();
		this.change();
	},
	bind: function() {
		this.selectElem.addEventListener('change', this.change);
	},
	change: function() {
		var value = colorScheme.selectElem.value;
		colorScheme.styleElem.href = 'assets/css/highlight/'+value+'.css';
		colorScheme.storage(value);
	},
	storage: function(value) {
		if (arguments.length === 0) {
			if (localStorage && localStorage.colorScheme) {
				colorScheme.selectElem.value = localStorage.colorScheme;
			}
		} else {
			localStorage.colorScheme = value;
		}
	}
}
myMarked.init();
colorScheme.init();
