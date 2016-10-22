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
		// 只显示4级目录就够了
		var elms = document.querySelectorAll('#html h1,#html h2,#html h3,#html h4');
		var htm = '', tag, text, id, h;
		for (var i=0, len = elms.length; i< len; i++) {
			h = elms[i];
			tag = h.tagName.toLowerCase();
			text = h.innerText;
			id = h.id;
			htm += '<li class="'+tag+'"><a  href="#'+id+'" title="'+text+'">'+text+'</a></li>';
		}
		myMarked.catElm.innerHTML =  htm ;
	},
	convert: function() {
		var value = myMarked.mdElm.value;
		myMarked.htmlElm.innerHTML = marked(value);
		hljs.initHighlighting.called = false;
		hljs.initHighlighting();

		// hljs 的样式和 flexbox 结合，当重新渲染的时候会有bug
		// <pre><code> 在 flexbox 之内，且 code 为 display:block; overflow-x: auto; 时
		// 当 flexbox 的 innerHTML 重新改变时, code 是无法滚动的
		// 估计是跟 pre 相关
		// 所以把样式放到 pre 上面
		// -- 发现渲染还是有点问题，不能正确渲染 margin ---
		// 不使用 flexbox 好了。
		/*
		var hlNode = document.querySelectorAll('.hljs');
		for (var i = hlNode.length - 1; i >= 0; i--) {
			hlNode[i].classList.remove("hljs");
			hlNode[i].parentNode.classList.add('hljs');
		}
		*/

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
