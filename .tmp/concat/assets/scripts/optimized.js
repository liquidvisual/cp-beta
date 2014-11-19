/*! http://mths.be/placeholder v2.0.8 by @mathias */
;(function(window, document, $) {

	// Opera Mini v7 doesn’t support placeholder although its DOM seems to indicate so
	var isOperaMini = Object.prototype.toString.call(window.operamini) == '[object OperaMini]';
	var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini;
	var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini;
	var prototype = $.fn;
	var valHooks = $.valHooks;
	var propHooks = $.propHooks;
	var hooks;
	var placeholder;

	if (isInputSupported && isTextareaSupported) {

		placeholder = prototype.placeholder = function() {
			return this;
		};

		placeholder.input = placeholder.textarea = true;

	} else {

		placeholder = prototype.placeholder = function() {
			var $this = this;
			$this
				.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
				.not('.placeholder')
				.bind({
					'focus.placeholder': clearPlaceholder,
					'blur.placeholder': setPlaceholder
				})
				.data('placeholder-enabled', true)
				.trigger('blur.placeholder');
			return $this;
		};

		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;

		hooks = {
			'get': function(element) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value;
				}

				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
			},
			'set': function(element, value) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value = value;
				}

				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value == '') {
					element.value = value;
					// Issue #56: Setting the placeholder causes problems if the element continues to have focus.
					if (element != safeActiveElement()) {
						// We can't use `triggerHandler` here because of dummy text/password inputs :(
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				// `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
				return $element;
			}
		};

		if (!isInputSupported) {
			valHooks.input = hooks;
			propHooks.value = hooks;
		}
		if (!isTextareaSupported) {
			valHooks.textarea = hooks;
			propHooks.value = hooks;
		}

		$(function() {
			// Look for forms
			$(document).delegate('form', 'submit.placeholder', function() {
				// Clear the placeholder values so they don't get submitted
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {};
		var rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this;
		var $input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				// If `clearPlaceholder` was called from `$.valHooks.input.set`
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == safeActiveElement() && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement;
		var input = this;
		var $input = $(input);
		var id = this.id;
		if (input.value == '') {
			if (input.type == 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().attr({ 'type': 'text' });
					} catch(e) {
						$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
					}
					$replacement
						.removeAttr('name')
						.data({
							'placeholder-password': $input,
							'placeholder-id': id
						})
						.bind('focus.placeholder', clearPlaceholder);
					$input
						.data({
							'placeholder-textinput': $replacement,
							'placeholder-id': id
						})
						.before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
				// Note: `$input[0] != input` now!
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}

	function safeActiveElement() {
		// Avoid IE9 `document.activeElement` of death
		// https://github.com/mathiasbynens/jquery-placeholder/pull/99
		try {
			return document.activeElement;
		} catch (exception) {}
	}

}(this, document, jQuery));

/*	
 * jQuery mmenu v4.5.7
 * @requires jQuery 1.7.0 or later
 *
 * mmenu.frebsite.nl
 *	
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * Licensed under the MIT license:
 * http://en.wikipedia.org/wiki/MIT_License
 */
!function(e){function n(n,s,t){if(t)return"object"!=typeof n&&(n={}),n;n=e.extend(!0,{},e[a].defaults,n);for(var i=["position","zposition","modal","moveBackground"],o=0,l=i.length;l>o;o++)"undefined"!=typeof n[i[o]]&&(e[a].deprecated('The option "'+i[o]+'"',"offCanvas."+i[o]),n.offCanvas=n.offCanvas||{},n.offCanvas[i[o]]=n[i[o]]);return n}function s(n){n=e.extend(!0,{},e[a].configuration,n);for(var s=["panel","list","selected","label","spacer"],t=0,i=s.length;i>t;t++)"undefined"!=typeof n[s[t]+"Class"]&&(e[a].deprecated('The configuration option "'+s[t]+'Class"',"classNames."+s[t]),n.classNames[s[t]]=n[s[t]+"Class"]);if("undefined"!=typeof n.counterClass&&(e[a].deprecated('The configuration option "counterClass"',"classNames.counters.counter"),n.classNames.counters=n.classNames.counters||{},n.classNames.counters.counter=n.counterClass),"undefined"!=typeof n.collapsedClass&&(e[a].deprecated('The configuration option "collapsedClass"',"classNames.labels.collapsed"),n.classNames.labels=n.classNames.labels||{},n.classNames.labels.collapsed=n.collapsedClass),"undefined"!=typeof n.header)for(var s=["panelHeader","panelNext","panelPrev"],t=0,i=s.length;i>t;t++)"undefined"!=typeof n.header[s[t]+"Class"]&&(e[a].deprecated('The configuration option "header.'+s[t]+'Class"',"classNames.header."+s[t]),n.classNames.header=n.classNames.header||{},n.classNames.header[s[t]]=n.header[s[t]+"Class"]);for(var s=["pageNodetype","pageSelector","menuWrapperSelector","menuInjectMethod"],t=0,i=s.length;i>t;t++)"undefined"!=typeof n[s[t]]&&(e[a].deprecated('The configuration option "'+s[t]+'"',"offCanvas."+s[t]),n.offCanvas=n.offCanvas||{},n.offCanvas[s[t]]=n[s[t]]);return n}function t(){r=!0,c.$wndw=e(window),c.$html=e("html"),c.$body=e("body"),e.each([o,l,d],function(e,n){n.add=function(e){e=e.split(" ");for(var s in e)n[e[s]]=n.mm(e[s])}}),o.mm=function(e){return"mm-"+e},o.add("wrapper menu inline panel nopanel list nolist subtitle selected label spacer current highest hidden opened subopened subopen fullsubopen subclose"),o.umm=function(e){return"mm-"==e.slice(0,3)&&(e=e.slice(3)),e},l.mm=function(e){return"mm-"+e},l.add("parent"),d.mm=function(e){return e+".mm"},d.add("toggle open close setSelected transitionend webkitTransitionEnd mousedown mouseup touchstart touchmove touchend scroll resize click keydown keyup"),e[a]._c=o,e[a]._d=l,e[a]._e=d,e[a].glbl=c}var a="mmenu",i="4.5.7";if(!e[a]){var o={},l={},d={},r=!1,c={$wndw:null,$html:null,$body:null};e[a]=function(e,s,t){return this.$menu=e,this.opts=s,this.conf=t,this.vars={},this.opts=n(this.opts,this.conf,this.$menu),this._initMenu(),this._init(this.$menu.children(this.conf.panelNodetype)),this},e[a].version=i,e[a].addons=[],e[a].uniqueId=0,e[a].defaults={classes:"",slidingSubmenus:!0,onClick:{setSelected:!0}},e[a].configuration={panelNodetype:"ul, ol, div",transitionDuration:400,openingInterval:25,classNames:{panel:"Panel",selected:"Selected",label:"Label",spacer:"Spacer"}},e[a].prototype={_init:function(n){n=n.not("."+o.nopanel),n=this._initPanels(n),n=this._initLinks(n),n=this._bindCustomEvents(n);for(var s=0;s<e[a].addons.length;s++)"function"==typeof this["_init_"+e[a].addons[s]]&&this["_init_"+e[a].addons[s]](n);this._update()},_initMenu:function(){this.opts.offCanvas&&this.conf.clone&&(this.$menu=this.$menu.clone(!0),this.$menu.add(this.$menu.find("*")).filter("[id]").each(function(){e(this).attr("id",o.mm(e(this).attr("id")))})),this.$menu.contents().each(function(){3==e(this)[0].nodeType&&e(this).remove()}),this.$menu.parent().addClass(o.wrapper);var n=[o.menu];n.push(o.mm(this.opts.slidingSubmenus?"horizontal":"vertical")),this.opts.classes&&n.push(this.opts.classes),this.$menu.addClass(n.join(" "))},_initPanels:function(n){var s=this;this.__findAddBack(n,"ul, ol").not("."+o.nolist).addClass(o.list);var t=this.__findAddBack(n,"."+o.list).find("> li");this.__refactorClass(t,this.conf.classNames.selected,"selected"),this.__refactorClass(t,this.conf.classNames.label,"label"),this.__refactorClass(t,this.conf.classNames.spacer,"spacer"),t.off(d.setSelected).on(d.setSelected,function(n,s){n.stopPropagation(),t.removeClass(o.selected),"boolean"!=typeof s&&(s=!0),s&&e(this).addClass(o.selected)}),this.__refactorClass(this.__findAddBack(n,"."+this.conf.classNames.panel),this.conf.classNames.panel,"panel"),n.add(this.__findAddBack(n,"."+o.list).children().children().filter(this.conf.panelNodetype).not("."+o.nopanel)).addClass(o.panel);var a=this.__findAddBack(n,"."+o.panel),i=e("."+o.panel,this.$menu);a.each(function(){var n=e(this),t=n.attr("id")||s.__getUniqueId();n.attr("id",t)}),a.each(function(){var n=e(this),t=n.is("ul, ol")?n:n.find("ul ,ol").first(),a=n.parent(),i=a.find("> a, > span"),d=a.closest("."+o.panel);if(a.parent().is("."+o.list)){n.data(l.parent,a);var r=e('<a class="'+o.subopen+'" href="#'+n.attr("id")+'" />').insertBefore(i);i.is("a")||r.addClass(o.fullsubopen),s.opts.slidingSubmenus&&t.prepend('<li class="'+o.subtitle+'"><a class="'+o.subclose+'" href="#'+d.attr("id")+'">'+i.text()+"</a></li>")}});var r=this.opts.slidingSubmenus?d.open:d.toggle;if(i.each(function(){var n=e(this),s=n.attr("id");e('a[href="#'+s+'"]',i).off(d.click).on(d.click,function(e){e.preventDefault(),n.trigger(r)})}),this.opts.slidingSubmenus){var c=this.__findAddBack(n,"."+o.list).find("> li."+o.selected);c.parents("li").removeClass(o.selected).end().add(c.parents("li")).each(function(){var n=e(this),s=n.find("> ."+o.panel);s.length&&(n.parents("."+o.panel).addClass(o.subopened),s.addClass(o.opened))}).closest("."+o.panel).addClass(o.opened).parents("."+o.panel).addClass(o.subopened)}else{var c=e("li."+o.selected,i);c.parents("li").removeClass(o.selected).end().add(c.parents("li")).addClass(o.opened)}var u=i.filter("."+o.opened);return u.length||(u=a.first()),u.addClass(o.opened).last().addClass(o.current),this.opts.slidingSubmenus&&a.not(u.last()).addClass(o.hidden).end().appendTo(this.$menu),a},_initLinks:function(n){var s=this;return this.__findAddBack(n,"."+o.list).find("> li > a").not("."+o.subopen).not("."+o.subclose).not('[rel="external"]').not('[target="_blank"]').off(d.click).on(d.click,function(n){var t=e(this),a=t.attr("href")||"";s.__valueOrFn(s.opts.onClick.setSelected,t)&&t.parent().trigger(d.setSelected);var i=s.__valueOrFn(s.opts.onClick.preventDefault,t,"#"==a.slice(0,1));i&&n.preventDefault(),s.__valueOrFn(s.opts.onClick.blockUI,t,!i)&&c.$html.addClass(o.blocking),s.__valueOrFn(s.opts.onClick.close,t,i)&&s.$menu.triggerHandler(d.close)}),n},_bindCustomEvents:function(n){var s=this;return n.off(d.toggle+" "+d.open+" "+d.close).on(d.toggle+" "+d.open+" "+d.close,function(e){e.stopPropagation()}),this.opts.slidingSubmenus?n.on(d.open,function(){return s._openSubmenuHorizontal(e(this))}):n.on(d.toggle,function(){var n=e(this);return n.triggerHandler(n.parent().hasClass(o.opened)?d.close:d.open)}).on(d.open,function(){return e(this).parent().addClass(o.opened),"open"}).on(d.close,function(){return e(this).parent().removeClass(o.opened),"close"}),n},_openSubmenuHorizontal:function(n){if(n.hasClass(o.current))return!1;var s=e("."+o.panel,this.$menu),t=s.filter("."+o.current);return s.removeClass(o.highest).removeClass(o.current).not(n).not(t).addClass(o.hidden),n.hasClass(o.opened)?t.addClass(o.highest).removeClass(o.opened).removeClass(o.subopened):(n.addClass(o.highest),t.addClass(o.subopened)),n.removeClass(o.hidden).addClass(o.current),setTimeout(function(){n.removeClass(o.subopened).addClass(o.opened)},this.conf.openingInterval),"open"},_update:function(e){if(this.updates||(this.updates=[]),"function"==typeof e)this.updates.push(e);else for(var n=0,s=this.updates.length;s>n;n++)this.updates[n].call(this,e)},__valueOrFn:function(e,n,s){return"function"==typeof e?e.call(n[0]):"undefined"==typeof e&&"undefined"!=typeof s?s:e},__refactorClass:function(e,n,s){e.filter("."+n).removeClass(n).addClass(o[s])},__findAddBack:function(e,n){return e.find(n).add(e.filter(n))},__transitionend:function(e,n,s){var t=!1,a=function(){t||n.call(e[0]),t=!0};e.one(d.transitionend,a),e.one(d.webkitTransitionEnd,a),setTimeout(a,1.1*s)},__getUniqueId:function(){return o.mm(e[a].uniqueId++)}},e.fn[a]=function(i,o){return r||t(),i=n(i,o),o=s(o),this.each(function(){var n=e(this);n.data(a)||n.data(a,new e[a](n,i,o))})},e[a].support={touch:"ontouchstart"in window.document},e[a].debug=function(){},e[a].deprecated=function(e,n){"undefined"!=typeof console&&"undefined"!=typeof console.warn&&console.warn("MMENU: "+e+" is deprecated, use "+n+" instead.")}}}(jQuery);
/*	
 * jQuery mmenu offCanvas addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
!function(e){function o(o){return("top"==o.position||"bottom"==o.position)&&("back"==o.zposition||"next"==o.zposition)&&(e[s].deprecated('Using position "'+o.position+'" in combination with zposition "'+o.zposition+'"','zposition "front"'),o.zposition="front"),o}function t(e){return"string"!=typeof e.pageSelector&&(e.pageSelector="> "+e.pageNodetype),e}function n(){c=!0,p=e[s]._c,a=e[s]._d,r=e[s]._e,p.add("offcanvas modal background opening blocker page"),a.add("style"),r.add("opening opened closing closed setPage"),l=e[s].glbl,l.$allMenus=(l.$allMenus||e()).add(this.$menu),l.$wndw.on(r.keydown,function(e){return l.$html.hasClass(p.opened)&&9==e.keyCode?(e.preventDefault(),!1):void 0});var o=0;l.$wndw.on(r.resize,function(e,t){if(t||l.$html.hasClass(p.opened)){var n=l.$wndw.height();(t||n!=o)&&(o=n,l.$page.css("minHeight",n))}})}var s="mmenu",i="offCanvas";e[s].prototype["_init_"+i]=function(){if(this.opts[i]&&!this.vars[i+"_added"]){this.vars[i+"_added"]=!0,c||n(),this.opts[i]=o(this.opts[i]),this.conf[i]=t(this.conf[i]);var e=this.opts[i],s=this.conf[i],a=[p.offcanvas];"boolean"!=typeof this.vars.opened&&(this.vars.opened=!1),"left"!=e.position&&a.push(p.mm(e.position)),"back"!=e.zposition&&a.push(p.mm(e.zposition)),this.$menu.addClass(a.join(" ")).parent().removeClass(p.wrapper),this[i+"_initPage"](l.$page),this[i+"_initBlocker"](),this[i+"_initOpenClose"](),this[i+"_bindCustomEvents"](),this.$menu[s.menuInjectMethod+"To"](s.menuWrapperSelector)}},e[s].addons.push(i),e[s].defaults[i]={position:"left",zposition:"back",modal:!1,moveBackground:!0},e[s].configuration[i]={pageNodetype:"div",pageSelector:null,menuWrapperSelector:"body",menuInjectMethod:"prepend"},e[s].prototype.open=function(){if(this.vars.opened)return!1;var e=this;return this._openSetup(),setTimeout(function(){e._openFinish()},this.conf.openingInterval),"open"},e[s].prototype._openSetup=function(){l.$allMenus.not(this.$menu).trigger(r.close),l.$page.data(a.style,l.$page.attr("style")||""),l.$wndw.trigger(r.resize,[!0]);var e=[p.opened];this.opts[i].modal&&e.push(p.modal),this.opts[i].moveBackground&&e.push(p.background),"left"!=this.opts[i].position&&e.push(p.mm(this.opts[i].position)),"back"!=this.opts[i].zposition&&e.push(p.mm(this.opts[i].zposition)),this.opts.classes&&e.push(this.opts.classes),l.$html.addClass(e.join(" ")),this.vars.opened=!0,this.$menu.addClass(p.current+" "+p.opened)},e[s].prototype._openFinish=function(){var e=this;this.__transitionend(l.$page,function(){e.$menu.trigger(r.opened)},this.conf.transitionDuration),l.$html.addClass(p.opening),this.$menu.trigger(r.opening)},e[s].prototype.close=function(){if(!this.vars.opened)return!1;var e=this;return this.__transitionend(l.$page,function(){e.$menu.removeClass(p.current).removeClass(p.opened),l.$html.removeClass(p.opened).removeClass(p.modal).removeClass(p.background).removeClass(p.mm(e.opts[i].position)).removeClass(p.mm(e.opts[i].zposition)),e.opts.classes&&l.$html.removeClass(e.opts.classes),l.$page.attr("style",l.$page.data(a.style)),e.vars.opened=!1,e.$menu.trigger(r.closed)},this.conf.transitionDuration),l.$html.removeClass(p.opening),this.$menu.trigger(r.closing),"close"},e[s].prototype[i+"_initBlocker"]=function(){var o=this;l.$blck||(l.$blck=e('<div id="'+p.blocker+'" />').appendTo(l.$body)),l.$blck.off(r.touchstart).on(r.touchstart,function(e){e.preventDefault(),e.stopPropagation(),l.$blck.trigger(r.mousedown)}).on(r.mousedown,function(e){e.preventDefault(),l.$html.hasClass(p.modal)||o.close()})},e[s].prototype[i+"_initPage"]=function(o){o||(o=e(this.conf[i].pageSelector,l.$body),o.length>1&&(e[s].debug("Multiple nodes found for the page-node, all nodes are wrapped in one <"+this.conf[i].pageNodetype+">."),o=o.wrapAll("<"+this.conf[i].pageNodetype+" />").parent())),o.addClass(p.page),l.$page=o},e[s].prototype[i+"_initOpenClose"]=function(){var o=this,t=this.$menu.attr("id");t&&t.length&&(this.conf.clone&&(t=p.umm(t)),e('a[href="#'+t+'"]').off(r.click).on(r.click,function(e){e.preventDefault(),o.open()}));var t=l.$page.attr("id");t&&t.length&&e('a[href="#'+t+'"]').on(r.click,function(e){e.preventDefault(),o.close()})},e[s].prototype[i+"_bindCustomEvents"]=function(){var e=this,o=r.open+" "+r.opening+" "+r.opened+" "+r.close+" "+r.closing+" "+r.closed+" "+r.setPage;this.$menu.off(o).on(o,function(e){e.stopPropagation()}),this.$menu.on(r.open,function(){e.open()}).on(r.close,function(){e.close()}).on(r.setPage,function(o,t){e[i+"_initPage"](t),e[i+"_initOpenClose"]()})};var p,a,r,l,c=!1}(jQuery);
/*	
 * jQuery mmenu buttonbars addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
!function(t){function n(t){return t}function a(t){return t}function i(){d=!0,o=t[r]._c,e=t[r]._d,u=t[r]._e,o.add("buttonbar"),c=t[r].glbl}var r="mmenu",s="buttonbars";t[r].prototype["_init_"+s]=function(r){d||i();var e=this.vars[s+"_added"];this.vars[s+"_added"]=!0,e||(this.opts[s]=n(this.opts[s]),this.conf[s]=a(this.conf[s])),this.opts[s],this.conf[s],this.__refactorClass(t("div",r),this.conf.classNames[s].buttonbar,"buttonbar"),t("div."+o.buttonbar,r).each(function(){var n=t(this),a=n.children().not("input"),i=n.children().filter("input");n.addClass(o.buttonbar+"-"+a.length),i.each(function(){var n=t(this),i=a.filter('label[for="'+n.attr("id")+'"]');i.length&&n.insertBefore(i)})})},t[r].addons.push(s),t[r].defaults[s]={},t[r].configuration.classNames[s]={buttonbar:"Buttonbar"};var o,e,u,c,d=!1}(jQuery);
/*	
 * jQuery mmenu counters addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
!function(t){function e(e){return"boolean"==typeof e&&(e={add:e,update:e}),"object"!=typeof e&&(e={}),e=t.extend(!0,{},t[o].defaults[s],e)}function n(t){return t}function a(){i=!0,d=t[o]._c,r=t[o]._d,u=t[o]._e,d.add("counter search noresultsmsg"),r.add("updatecounter"),c=t[o].glbl}var o="mmenu",s="counters";t[o].prototype["_init_"+s]=function(o){i||a();var u=this.vars[s+"_added"];this.vars[s+"_added"]=!0,u||(this.opts[s]=e(this.opts[s]),this.conf[s]=n(this.conf[s]));var c=this,h=this.opts[s];this.conf[s],this.__refactorClass(t("em",o),this.conf.classNames[s].counter,"counter"),h.add&&o.each(function(){var e=t(this).data(r.parent);e&&(e.find("> em."+d.counter).length||e.prepend(t('<em class="'+d.counter+'" />')))}),h.update&&o.each(function(){var e=t(this),n=e.data(r.parent);if(n){var a=n.find("> em."+d.counter);a.length&&(e.is("."+d.list)||(e=e.find("> ."+d.list)),e.length&&!e.data(r.updatecounter)&&(e.data(r.updatecounter,!0),c._update(function(){var t=e.children().not("."+d.label).not("."+d.subtitle).not("."+d.hidden).not("."+d.search).not("."+d.noresultsmsg);a.html(t.length)})))}})},t[o].addons.push(s),t[o].defaults[s]={add:!1,update:!1},t[o].configuration.classNames[s]={counter:"Counter"};var d,r,u,c,i=!1}(jQuery);
/*	
 * jQuery mmenu dragOpen addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
!function(e){function t(e,t,n){return t>e&&(e=t),e>n&&(e=n),e}function n(t){return"boolean"==typeof t&&(t={open:t}),"object"!=typeof t&&(t={}),t=e.extend(!0,{},e[s].defaults[i],t)}function o(e){return e}function a(){c=!0,r=e[s]._c,p=e[s]._d,f=e[s]._e,r.add("dragging"),d=e[s].glbl}var s="mmenu",i="dragOpen";e[s].prototype["_init_"+i]=function(){if("function"==typeof Hammer&&this.opts.offCanvas&&!this.vars[i+"_added"]){this.vars[i+"_added"]=!0,c||a(),this.opts[i]=n(this.opts[i]),this.conf[i]=o(this.conf[i]);var p=this,h=this.opts[i],m=this.conf[i];if(h.open){if(Hammer.VERSION<2)return e[s].deprecated("Older version of the Hammer library","version 2 or newer"),!1;var u,g,l,v,_={},w=0,b=!1,y=!1,$=0,x=0;switch(this.opts.offCanvas.position){case"left":case"right":_.events="panleft panright",_.typeLower="x",_.typeUpper="X",y="width";break;case"top":case"bottom":_.events="panup pandown",_.typeLower="y",_.typeUpper="Y",y="height"}switch(this.opts.offCanvas.position){case"left":case"top":_.negative=!1;break;case"right":case"bottom":_.negative=!0}switch(this.opts.offCanvas.position){case"left":_.open_dir="right",_.close_dir="left";break;case"right":_.open_dir="left",_.close_dir="right";break;case"top":_.open_dir="down",_.close_dir="up";break;case"bottom":_.open_dir="up",_.close_dir="down"}var C=this.__valueOrFn(h.pageNode,this.$menu,d.$page);"string"==typeof C&&(C=e(C));var k=d.$page;switch(this.opts.offCanvas.zposition){case"front":k=this.$menu;break;case"next":k=k.add(this.$menu)}var S=new Hammer(C[0]);S.on("panstart",function(e){switch(v=e.center[_.typeLower],p.opts.offCanvas.position){case"right":case"bottom":v>=d.$wndw[y]()-h.maxStartPos&&(w=1);break;default:v<=h.maxStartPos&&(w=1)}b=_.open_dir}).on(_.events+" panend",function(e){w>0&&e.preventDefault()}).on(_.events,function(e){if(u=e["delta"+_.typeUpper],_.negative&&(u=-u),u!=$&&(b=u>=$?_.open_dir:_.close_dir),$=u,$>h.threshold&&1==w){if(d.$html.hasClass(r.opened))return;w=2,p._openSetup(),p.$menu.trigger(f.opening),d.$html.addClass(r.dragging),x=t(d.$wndw[y]()*m[y].perc,m[y].min,m[y].max)}2==w&&(g=t($,10,x)-("front"==p.opts.offCanvas.zposition?x:0),_.negative&&(g=-g),l="translate"+_.typeUpper+"("+g+"px )",k.css({"-webkit-transform":"-webkit-"+l,transform:l}))}).on("panend",function(){2==w&&(d.$html.removeClass(r.dragging),k.css("transform",""),p[b==_.open_dir?"_openFinish":"close"]()),w=0})}}},e[s].addons.push(i),e[s].defaults[i]={open:!1,maxStartPos:100,threshold:50},e[s].configuration[i]={width:{perc:.8,min:140,max:440},height:{perc:.8,min:140,max:880}};var r,p,f,d,c=!1}(jQuery);
/*	
 * jQuery mmenu fixedElements addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
!function(t){function s(t){return t}function o(t){return t}function n(){c=!0,e=t[i]._c,f=t[i]._d,r=t[i]._e,e.add("fixed-top fixed-bottom"),d=t[i].glbl}var i="mmenu",a="fixedElements";t[i].prototype["_init_"+a]=function(){if(this.opts.offCanvas){c||n();var i=this.vars[a+"_added"];if(this.vars[a+"_added"]=!0,i||(this.opts[a]=s(this.opts[a]),this.conf[a]=o(this.conf[a])),this.opts[a],this.conf[a],this.__refactorClass(t("div, span, a",d.$page),this.conf.classNames[a].fixedTop,"fixed-top"),this.__refactorClass(t("div, span, a",d.$page),this.conf.classNames[a].fixedBottom,"fixed-bottom"),!i){var f,p;this.$menu.on(r.opening,function(){var s=t(window).scrollTop(),o=d.$page.height()-s-d.$wndw.height();f=t("."+e["fixed-top"]),p=t("."+e["fixed-bottom"]),f.css({"-webkit-transform":"translateY( "+s+"px )",transform:"translateY( "+s+"px )"}),p.css({"-webkit-transform":"translateY( -"+o+"px )",transform:"translateY( -"+o+"px )"})}).on(r.closed,function(){f.add(p).css({"-webkit-transform":"none",transform:"none"})})}}},t[i].addons.push(a),t[i].defaults[a]={},t[i].configuration.classNames[a]={fixedTop:"FixedTop",fixedBottom:"FixedBottom"};var e,f,r,d,c=!1}(jQuery);
/*	
 * jQuery mmenu footer addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
!function(t){function o(o){return"boolean"==typeof o&&(o={add:o,update:o}),"object"!=typeof o&&(o={}),o=t.extend(!0,{},t[a].defaults[s],o)}function n(t){return t}function e(){h=!0,i=t[a]._c,d=t[a]._d,r=t[a]._e,i.add("footer hasfooter"),f=t[a].glbl}var a="mmenu",s="footer";t[a].prototype["_init_"+s]=function(a){h||e();var d=this.vars[s+"_added"];this.vars[s+"_added"]=!0,d||(this.opts[s]=o(this.opts[s]),this.conf[s]=n(this.conf[s]));var f=this,u=this.opts[s];if(this.conf[s],!d&&u.add){var c=u.content?u.content:u.title;t('<div class="'+i.footer+'" />').appendTo(this.$menu).append(c)}var p=t("div."+i.footer,this.$menu);p.length&&(this.$menu.addClass(i.hasfooter),u.update&&a.each(function(){var o=t(this),n=t("."+f.conf.classNames[s].panelFooter,o),e=n.html();e||(e=u.title);var a=function(){p[e?"show":"hide"](),p.html(e)};o.on(r.open,a),o.hasClass(i.current)&&a()}),"function"==typeof this._init_buttonbars&&this._init_buttonbars(p))},t[a].addons.push(s),t[a].defaults[s]={add:!1,content:!1,title:"",update:!1},t[a].configuration.classNames[s]={panelFooter:"Footer"};var i,d,r,f,h=!1}(jQuery);
/*	
 * jQuery mmenu header addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
!function(e){function t(t){return"boolean"==typeof t&&(t={add:t,update:t}),"object"!=typeof t&&(t={}),t=e.extend(!0,{},e[s].defaults[r],t)}function a(e){return e}function n(){l=!0,i=e[s]._c,o=e[s]._d,h=e[s]._e,i.add("header hasheader prev next title"),d=e[s].glbl}var s="mmenu",r="header";e[s].prototype["_init_"+r]=function(s){l||n();var o=this.vars[r+"_added"];this.vars[r+"_added"]=!0,o||(this.opts[r]=t(this.opts[r]),this.conf[r]=a(this.conf[r]));var c=this,f=this.opts[r];if(this.conf[r],!o&&f.add){var p=f.content?f.content:'<a class="'+i.prev+'" href="#"></a><span class="'+i.title+'"></span><a class="'+i.next+'" href="#"></a>';e('<div class="'+i.header+'" />').prependTo(this.$menu).append(p)}var u=e("div."+i.header,this.$menu);if(u.length){if(this.$menu.addClass(i.hasheader),f.update){var v=u.find("."+i.title),m=u.find("."+i.prev),_=u.find("."+i.next),g=!1;d.$page&&(g="#"+d.$page.attr("id")),o||m.add(_).off(h.click).on(h.click,function(t){t.preventDefault(),t.stopPropagation();var a=e(this).attr("href");"#"!==a&&(g&&a==g?c.$menu.trigger(h.close):e(a,c.$menu).trigger(h.open))}),s.each(function(){var t=e(this),a=e("."+c.conf.classNames[r].panelHeader,t),n=e("."+c.conf.classNames[r].panelPrev,t),s=e("."+c.conf.classNames[r].panelNext,t),o=a.html(),d=n.attr("href"),l=s.attr("href");o||(o=e("."+i.subclose,t).html()),o||(o=f.title),d||(d=e("."+i.subclose,t).attr("href"));var p=n.html(),u=s.html(),g=function(){v[o?"show":"hide"](),v.html(o),m[d?"attr":"removeAttr"]("href",d),m[d||p?"show":"hide"](),m.html(p),_[l?"attr":"removeAttr"]("href",l),_[l||u?"show":"hide"](),_.html(u)};t.on(h.open,g),t.hasClass(i.current)&&g()})}"function"==typeof this._init_buttonbars&&this._init_buttonbars(u)}},e[s].addons.push(r),e[s].defaults[r]={add:!1,content:!1,title:"Menu",update:!1},e[s].configuration.classNames[r]={panelHeader:"Header",panelNext:"Next",panelPrev:"Prev"};var i,o,h,d,l=!1}(jQuery);
/*	
 * jQuery mmenu labels addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
!function(l){function a(a){return"boolean"==typeof a&&(a={collapse:a}),"object"!=typeof a&&(a={}),a=l.extend(!0,{},l[o].defaults[t],a)}function e(l){return l}function s(){i=!0,n=l[o]._c,d=l[o]._d,c=l[o]._e,n.add("collapsed"),d.add("updatelabel"),p=l[o].glbl}var o="mmenu",t="labels";l[o].prototype["_init_"+t]=function(o){i||s();var p=this.vars[t+"_added"];this.vars[t+"_added"]=!0,p||(this.opts[t]=a(this.opts[t]),this.conf[t]=e(this.conf[t]));var u=this.opts[t];this.conf[t],u.collapse&&(this.__refactorClass(l("li",this.$menu),this.conf.classNames[t].collapsed,"collapsed"),l("."+n.label,o).each(function(){var a=l(this),e=a.nextUntil("."+n.label,"all"==u.collapse?null:"."+n.collapsed);"all"==u.collapse&&(a.addClass(n.opened),e.removeClass(n.collapsed)),e.length&&(a.data(d.updatelabel)||(a.data(d.updatelabel,!0),a.wrapInner("<span />"),a.prepend('<a href="#" class="'+n.subopen+" "+n.fullsubopen+'" />')),a.find("a."+n.subopen).off(c.click).on(c.click,function(l){l.preventDefault(),a.toggleClass(n.opened),e[a.hasClass(n.opened)?"removeClass":"addClass"](n.collapsed)}))}))},l[o].addons.push(t),l[o].defaults[t]={collapse:!1},l[o].configuration.classNames[t]={collapsed:"Collapsed"};var n,d,c,p,i=!1}(jQuery);
/*	
 * jQuery mmenu searchfield addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
!function(e){function s(e){switch(e){case 9:case 16:case 17:case 18:case 37:case 38:case 39:case 40:return!0}return!1}function n(s){return"boolean"==typeof s&&(s={add:s,search:s}),"object"!=typeof s&&(s={}),s=e.extend(!0,{},e[r].defaults[o],s),"boolean"!=typeof s.showLinksOnly&&(s.showLinksOnly="menu"==s.addTo),s}function t(e){return e}function a(){c=!0,i=e[r]._c,l=e[r]._d,d=e[r]._e,i.add("search hassearch noresultsmsg noresults nosubresults"),d.add("search reset change"),h=e[r].glbl}var r="mmenu",o="searchfield";e[r].prototype["_init_"+o]=function(r){c||a();var h=this.vars[o+"_added"];this.vars[o+"_added"]=!0,h||(this.opts[o]=n(this.opts[o]),this.conf[o]=t(this.conf[o]));var u=this,f=this.opts[o];if(this.conf[o],f.add){switch(f.addTo){case"menu":var p=this.$menu;break;case"panels":var p=r;break;default:var p=e(f.addTo,this.$menu).filter("."+i.panel)}p.length&&p.each(function(){var s=e(this),n=s.is("."+i.list)?"li":"div";if(!s.children(n+"."+i.search).length){if(s.is("."+i.menu))var t=u.$menu,a="prependTo";else var t=s.children().first(),a=t.is("."+i.subtitle)?"insertAfter":"insertBefore";e("<"+n+' class="'+i.search+'" />').append('<input placeholder="'+f.placeholder+'" type="text" autocomplete="off" />')[a](t)}f.noResults&&(s.is("."+i.menu)&&(s=s.children("."+i.panel).first()),n=s.is("."+i.list)?"li":"div",s.children(n+"."+i.noresultsmsg).length||e("<"+n+' class="'+i.noresultsmsg+'" />').html(f.noResults).appendTo(s))})}if(this.$menu.children("div."+i.search).length&&this.$menu.addClass(i.hassearch),f.search){var v=e("."+i.search,this.$menu);v.length&&v.each(function(){var n=e(this);if("menu"==f.addTo)var t=e("."+i.panel,u.$menu),a=u.$menu;else var t=n.closest("."+i.panel),a=t;var r=n.children("input"),o=u.__findAddBack(t,"."+i.list).children("li"),h=o.filter("."+i.label),c=o.not("."+i.subtitle).not("."+i.label).not("."+i.search).not("."+i.noresultsmsg),p="> a";f.showLinksOnly||(p+=", > span"),r.off(d.keyup+" "+d.change).on(d.keyup,function(e){s(e.keyCode)||n.trigger(d.search)}).on(d.change,function(){n.trigger(d.search)}),n.off(d.reset+" "+d.search).on(d.reset+" "+d.search,function(e){e.stopPropagation()}).on(d.reset,function(){n.trigger(d.search,[""])}).on(d.search,function(s,n){"string"==typeof n?r.val(n):n=r.val(),n=n.toLowerCase(),t.scrollTop(0),c.add(h).addClass(i.hidden),c.each(function(){var s=e(this);e(p,s).text().toLowerCase().indexOf(n)>-1&&s.add(s.prevAll("."+i.label).first()).removeClass(i.hidden)}),e(t.get().reverse()).each(function(s){var n=e(this),t=n.data(l.parent);if(t){var a=n.add(n.find("> ."+i.list)).find("> li").not("."+i.subtitle).not("."+i.search).not("."+i.noresultsmsg).not("."+i.label).not("."+i.hidden);a.length?t.removeClass(i.hidden).removeClass(i.nosubresults).prevAll("."+i.label).first().removeClass(i.hidden):"menu"==f.addTo&&(n.hasClass(i.opened)&&setTimeout(function(){t.trigger(d.open)},1.5*(s+1)*u.conf.openingInterval),t.addClass(i.nosubresults))}}),a[c.not("."+i.hidden).length?"removeClass":"addClass"](i.noresults),u._update()})})}},e[r].addons.push(o),e[r].defaults[o]={add:!1,addTo:"menu",search:!1,placeholder:"Search",noResults:"No results found."};var i,l,d,h,c=!1}(jQuery);
/*	
 * jQuery mmenu toggles addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
!function(t){function s(t){return t}function e(t){return t}function a(){r=!0,n=t[c]._c,o=t[c]._d,l=t[c]._e,n.add("toggle check"),h=t[c].glbl}var c="mmenu",i="toggles";t[c].prototype["_init_"+i]=function(c){r||a();var o=this.vars[i+"_added"];this.vars[i+"_added"]=!0,o||(this.opts[i]=s(this.opts[i]),this.conf[i]=e(this.conf[i]));var l=this;this.opts[i],this.conf[i],this.__refactorClass(t("input",c),this.conf.classNames[i].toggle,"toggle"),this.__refactorClass(t("input",c),this.conf.classNames[i].check,"check"),t("input."+n.toggle,c).add("input."+n.check,c).each(function(){var s=t(this),e=s.closest("li"),a=s.hasClass(n.toggle)?"toggle":"check",c=s.attr("id")||l.__getUniqueId();e.children('label[for="'+c+'"]').length||(s.attr("id",c),e.prepend(s),t('<label for="'+c+'" class="'+n[a]+'"></label>').insertBefore(e.children("a, span").last()))})},t[c].addons.push(i),t[c].defaults[i]={},t[c].configuration.classNames[i]={toggle:"Toggle",check:"Check"};var n,o,l,h,r=!1}(jQuery);
/**
 * Copyright (c) 2007-2014 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 1.4.13
 */
;(function(k){'use strict';k(['jquery'],function($){var j=$.scrollTo=function(a,b,c){return $(window).scrollTo(a,b,c)};j.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:!0};j.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(f,g,h){if(typeof g=='object'){h=g;g=0}if(typeof h=='function')h={onAfter:h};if(f=='max')f=9e9;h=$.extend({},j.defaults,h);g=g||h.duration;h.queue=h.queue&&h.axis.length>1;if(h.queue)g/=2;h.offset=both(h.offset);h.over=both(h.over);return this._scrollable().each(function(){if(f==null)return;var d=this,$elem=$(d),targ=f,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=win?$(targ):$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}var e=$.isFunction(h.offset)&&h.offset(d,targ)||h.offset;$.each(h.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=j.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(h.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=e[pos]||0;if(h.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*h.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(h.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&h.queue){if(old!=attr[key])animate(h.onAfterFirst);delete attr[key]}});animate(h.onAfter);function animate(a){$elem.animate(attr,g,h.easing,a&&function(){a.call(this,targ,h)})}}).end()};j.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return $.isFunction(a)||typeof a=='object'?a:{top:a,left:a}}return j})}(typeof define==='function'&&define.amd?define:function(a,b){if(typeof module!=='undefined'&&module.exports){module.exports=b(require('jquery'))}else{b(jQuery)}}));
/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 1.0.3
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specified layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 * @param {Object} options The options to override the defaults
 */
function FastClick(layer, options) {
	'use strict';
	var oldOnClick;

	options = options || {};

	/**
	 * Whether a click is currently being tracked.
	 *
	 * @type boolean
	 */
	this.trackingClick = false;


	/**
	 * Timestamp for when click tracking started.
	 *
	 * @type number
	 */
	this.trackingClickStart = 0;


	/**
	 * The element being tracked for a click.
	 *
	 * @type EventTarget
	 */
	this.targetElement = null;


	/**
	 * X-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartX = 0;


	/**
	 * Y-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartY = 0;


	/**
	 * ID of the last touch, retrieved from Touch.identifier.
	 *
	 * @type number
	 */
	this.lastTouchIdentifier = 0;


	/**
	 * Touchmove boundary, beyond which a click will be cancelled.
	 *
	 * @type number
	 */
	this.touchBoundary = options.touchBoundary || 10;


	/**
	 * The FastClick layer.
	 *
	 * @type Element
	 */
	this.layer = layer;

	/**
	 * The minimum time between tap(touchstart and touchend) events
	 *
	 * @type number
	 */
	this.tapDelay = options.tapDelay || 200;

	if (FastClick.notNeeded(layer)) {
		return;
	}

	// Some old versions of Android don't have Function.prototype.bind
	function bind(method, context) {
		return function() { return method.apply(context, arguments); };
	}


	var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
	var context = this;
	for (var i = 0, l = methods.length; i < l; i++) {
		context[methods[i]] = bind(context[methods[i]], context);
	}

	// Set up event handlers as required
	if (deviceIsAndroid) {
		layer.addEventListener('mouseover', this.onMouse, true);
		layer.addEventListener('mousedown', this.onMouse, true);
		layer.addEventListener('mouseup', this.onMouse, true);
	}

	layer.addEventListener('click', this.onClick, true);
	layer.addEventListener('touchstart', this.onTouchStart, false);
	layer.addEventListener('touchmove', this.onTouchMove, false);
	layer.addEventListener('touchend', this.onTouchEnd, false);
	layer.addEventListener('touchcancel', this.onTouchCancel, false);

	// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	// layer when they are cancelled.
	if (!Event.prototype.stopImmediatePropagation) {
		layer.removeEventListener = function(type, callback, capture) {
			var rmv = Node.prototype.removeEventListener;
			if (type === 'click') {
				rmv.call(layer, type, callback.hijacked || callback, capture);
			} else {
				rmv.call(layer, type, callback, capture);
			}
		};

		layer.addEventListener = function(type, callback, capture) {
			var adv = Node.prototype.addEventListener;
			if (type === 'click') {
				adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
					if (!event.propagationStopped) {
						callback(event);
					}
				}), capture);
			} else {
				adv.call(layer, type, callback, capture);
			}
		};
	}

	// If a handler is already declared in the element's onclick attribute, it will be fired before
	// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	// adding it as listener.
	if (typeof layer.onclick === 'function') {

		// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
		// - the old one won't work if passed to addEventListener directly.
		oldOnClick = layer.onclick;
		layer.addEventListener('click', function(event) {
			oldOnClick(event);
		}, false);
		layer.onclick = null;
	}
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);

/**
 * BlackBerry requires exceptions.
 *
 * @type boolean
 */
var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {

	// Don't send a synthetic click to disabled inputs (issue #62)
	case 'button':
	case 'select':
	case 'textarea':
		if (target.disabled) {
			return true;
		}

		break;
	case 'input':

		// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
		if ((deviceIsIOS && target.type === 'file') || target.disabled) {
			return true;
		}

		break;
	case 'label':
	case 'video':
		return true;
	}

	return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {
	case 'textarea':
		return true;
	case 'select':
		return !deviceIsAndroid;
	case 'input':
		switch (target.type) {
		case 'button':
		case 'checkbox':
		case 'file':
		case 'image':
		case 'radio':
		case 'submit':
			return false;
		}

		// No point in attempting to focus disabled inputs
		return !target.disabled && !target.readOnly;
	default:
		return (/\bneedsfocus\b/).test(target.className);
	}
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
	'use strict';
	var clickEvent, touch;

	// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	if (document.activeElement && document.activeElement !== targetElement) {
		document.activeElement.blur();
	}

	touch = event.changedTouches[0];

	// Synthesise a click event, with an extra attribute so it can be tracked
	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	clickEvent.forwardedTouchEvent = true;
	targetElement.dispatchEvent(clickEvent);
};

FastClick.prototype.determineEventType = function(targetElement) {
	'use strict';

	//Issue #159: Android Chrome Select Box does not open with a synthetic click event
	if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
		return 'mousedown';
	}

	return 'click';
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
	'use strict';
	var length;

	// Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
	'use strict';
	var scrollParent, parentElement;

	scrollParent = targetElement.fastClickScrollParent;

	// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	// target element was moved to another parent.
	if (!scrollParent || !scrollParent.contains(targetElement)) {
		parentElement = targetElement;
		do {
			if (parentElement.scrollHeight > parentElement.offsetHeight) {
				scrollParent = parentElement;
				targetElement.fastClickScrollParent = parentElement;
				break;
			}

			parentElement = parentElement.parentElement;
		} while (parentElement);
	}

	// Always update the scroll top tracker if possible.
	if (scrollParent) {
		scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	}
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	'use strict';

	// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	if (eventTarget.nodeType === Node.TEXT_NODE) {
		return eventTarget.parentNode;
	}

	return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
	'use strict';
	var targetElement, touch, selection;

	// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	if (event.targetTouches.length > 1) {
		return true;
	}

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (deviceIsIOS) {

		// Only trusted events will deselect text on iOS (issue #49)
		selection = window.getSelection();
		if (selection.rangeCount && !selection.isCollapsed) {
			return true;
		}

		if (!deviceIsIOS4) {

			// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
			// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
			// with the same identifier as the touch event that previously triggered the click that triggered the alert.
			// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
			// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
			// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
			// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
			// random integers, it's safe to to continue if the identifier is 0 here.
			if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
				event.preventDefault();
				return false;
			}

			this.lastTouchIdentifier = touch.identifier;

			// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
			// 1) the user does a fling scroll on the scrollable layer
			// 2) the user stops the fling scroll with another tap
			// then the event.target of the last 'touchend' event will be the element that was under the user's finger
			// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
			// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
			this.updateScrollParent(targetElement);
		}
	}

	this.trackingClick = true;
	this.trackingClickStart = event.timeStamp;
	this.targetElement = targetElement;

	this.touchStartX = touch.pageX;
	this.touchStartY = touch.pageY;

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
		event.preventDefault();
	}

	return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
	'use strict';
	var touch = event.changedTouches[0], boundary = this.touchBoundary;

	if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
		return true;
	}

	return false;
};


/**
 * Update the last position.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchMove = function(event) {
	'use strict';
	if (!this.trackingClick) {
		return true;
	}

	// If the touch has moved, cancel the click tracking
	if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	return true;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
	'use strict';

	// Fast path for newer browsers supporting the HTML5 control attribute
	if (labelElement.control !== undefined) {
		return labelElement.control;
	}

	// All browsers under test that support touch events also support the HTML5 htmlFor attribute
	if (labelElement.htmlFor) {
		return document.getElementById(labelElement.htmlFor);
	}

	// If no for attribute exists, attempt to retrieve the first labellable descendant element
	// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
	'use strict';
	var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

	if (!this.trackingClick) {
		return true;
	}

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
		this.cancelNextClick = true;
		return true;
	}

	// Reset to prevent wrong click cancel on input (issue #156).
	this.cancelNextClick = false;

	this.lastClickTime = event.timeStamp;

	trackingClickStart = this.trackingClickStart;
	this.trackingClick = false;
	this.trackingClickStart = 0;

	// On some iOS devices, the targetElement supplied with the event is invalid if the layer
	// is performing a transition or scroll, and has to be re-detected manually. Note that
	// for this to function correctly, it must be called *after* the event target is checked!
	// See issue #57; also filed as rdar://13048589 .
	if (deviceIsIOSWithBadTarget) {
		touch = event.changedTouches[0];

		// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
		targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
		targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	}

	targetTagName = targetElement.tagName.toLowerCase();
	if (targetTagName === 'label') {
		forElement = this.findControl(targetElement);
		if (forElement) {
			this.focus(targetElement);
			if (deviceIsAndroid) {
				return false;
			}

			targetElement = forElement;
		}
	} else if (this.needsFocus(targetElement)) {

		// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
		// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
		if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
			this.targetElement = null;
			return false;
		}

		this.focus(targetElement);
		this.sendClick(targetElement, event);

		// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
		// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
		if (!deviceIsIOS || targetTagName !== 'select') {
			this.targetElement = null;
			event.preventDefault();
		}

		return false;
	}

	if (deviceIsIOS && !deviceIsIOS4) {

		// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
		// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
		scrollParent = targetElement.fastClickScrollParent;
		if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
			return true;
		}
	}

	// Prevent the actual click from going though - unless the target node is marked as requiring
	// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	if (!this.needsClick(targetElement)) {
		event.preventDefault();
		this.sendClick(targetElement, event);
	}

	return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
	'use strict';
	this.trackingClick = false;
	this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
	'use strict';

	// If a target element was never set (because a touch event was never fired) allow the event
	if (!this.targetElement) {
		return true;
	}

	if (event.forwardedTouchEvent) {
		return true;
	}

	// Programmatically generated events targeting a specific element should be permitted
	if (!event.cancelable) {
		return true;
	}

	// Derive and check the target element to see whether the mouse event needs to be permitted;
	// unless explicitly enabled, prevent non-touch click events from triggering actions,
	// to prevent ghost/doubleclicks.
	if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

		// Prevent any user-added listeners declared on FastClick element from being fired.
		if (event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		} else {

			// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			event.propagationStopped = true;
		}

		// Cancel the event
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	// If the mouse event is permitted, return true for the action to go through.
	return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
	'use strict';
	var permitted;

	// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	if (this.trackingClick) {
		this.targetElement = null;
		this.trackingClick = false;
		return true;
	}

	// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	if (event.target.type === 'submit' && event.detail === 0) {
		return true;
	}

	permitted = this.onMouse(event);

	// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	if (!permitted) {
		this.targetElement = null;
	}

	// If clicks are permitted, return true for the action to go through.
	return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
	'use strict';
	var layer = this.layer;

	if (deviceIsAndroid) {
		layer.removeEventListener('mouseover', this.onMouse, true);
		layer.removeEventListener('mousedown', this.onMouse, true);
		layer.removeEventListener('mouseup', this.onMouse, true);
	}

	layer.removeEventListener('click', this.onClick, true);
	layer.removeEventListener('touchstart', this.onTouchStart, false);
	layer.removeEventListener('touchmove', this.onTouchMove, false);
	layer.removeEventListener('touchend', this.onTouchEnd, false);
	layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function(layer) {
	'use strict';
	var metaViewport;
	var chromeVersion;
	var blackberryVersion;

	// Devices that don't support touch don't need FastClick
	if (typeof window.ontouchstart === 'undefined') {
		return true;
	}

	// Chrome version - zero for other browsers
	chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

	if (chromeVersion) {

		if (deviceIsAndroid) {
			metaViewport = document.querySelector('meta[name=viewport]');

			if (metaViewport) {
				// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// Chrome 32 and above with width=device-width or less don't need FastClick
				if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
					return true;
				}
			}

		// Chrome desktop doesn't need FastClick (issue #15)
		} else {
			return true;
		}
	}

	if (deviceIsBlackBerry10) {
		blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

		// BlackBerry 10.3+ does not require Fastclick library.
		// https://github.com/ftlabs/fastclick/issues/251
		if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
			metaViewport = document.querySelector('meta[name=viewport]');

			if (metaViewport) {
				// user-scalable=no eliminates click delay.
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// width=device-width (or less than device-width) eliminates click delay.
				if (document.documentElement.scrollWidth <= window.outerWidth) {
					return true;
				}
			}
		}
	}

	// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
	if (layer.style.msTouchAction === 'none') {
		return true;
	}

	return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 * @param {Object} options The options to override the defaults
 */
FastClick.attach = function(layer, options) {
	'use strict';
	return new FastClick(layer, options);
};


if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {

	// AMD. Register as an anonymous module.
	define(function() {
		'use strict';
		return FastClick;
	});
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = FastClick.attach;
	module.exports.FastClick = FastClick;
} else {
	window.FastClick = FastClick;
}

/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2014 Rico Sta. Cruz
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */

/* jshint expr: true */

;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(root.jQuery);
  }

}(this, function($) {

  $.transit = {
    version: "0.9.12",

    // Map of $.css() keys to values for 'transitionProperty'.
    // See https://developer.mozilla.org/en/CSS/CSS_transitions#Properties_that_can_be_animated
    propertyMap: {
      marginLeft    : 'margin',
      marginRight   : 'margin',
      marginBottom  : 'margin',
      marginTop     : 'margin',
      paddingLeft   : 'padding',
      paddingRight  : 'padding',
      paddingBottom : 'padding',
      paddingTop    : 'padding'
    },

    // Will simply transition "instantly" if false
    enabled: true,

    // Set this to false if you don't want to use the transition end property.
    useTransitionEnd: false
  };

  var div = document.createElement('div');
  var support = {};

  // Helper function to get the proper vendor property name.
  // (`transition` => `WebkitTransition`)
  function getVendorPropertyName(prop) {
    // Handle unprefixed versions (FF16+, for example)
    if (prop in div.style) return prop;

    var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
    var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

    for (var i=0; i<prefixes.length; ++i) {
      var vendorProp = prefixes[i] + prop_;
      if (vendorProp in div.style) { return vendorProp; }
    }
  }

  // Helper function to check if transform3D is supported.
  // Should return true for Webkits and Firefox 10+.
  function checkTransform3dSupport() {
    div.style[support.transform] = '';
    div.style[support.transform] = 'rotateY(90deg)';
    return div.style[support.transform] !== '';
  }

  var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

  // Check for the browser's transitions support.
  support.transition      = getVendorPropertyName('transition');
  support.transitionDelay = getVendorPropertyName('transitionDelay');
  support.transform       = getVendorPropertyName('transform');
  support.transformOrigin = getVendorPropertyName('transformOrigin');
  support.filter          = getVendorPropertyName('Filter');
  support.transform3d     = checkTransform3dSupport();

  var eventNames = {
    'transition':       'transitionend',
    'MozTransition':    'transitionend',
    'OTransition':      'oTransitionEnd',
    'WebkitTransition': 'webkitTransitionEnd',
    'msTransition':     'MSTransitionEnd'
  };

  // Detect the 'transitionend' event needed.
  var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;

  // Populate jQuery's `$.support` with the vendor prefixes we know.
  // As per [jQuery's cssHooks documentation](http://api.jquery.com/jQuery.cssHooks/),
  // we set $.support.transition to a string of the actual property name used.
  for (var key in support) {
    if (support.hasOwnProperty(key) && typeof $.support[key] === 'undefined') {
      $.support[key] = support[key];
    }
  }

  // Avoid memory leak in IE.
  div = null;

  // ## $.cssEase
  // List of easing aliases that you can use with `$.fn.transition`.
  $.cssEase = {
    '_default':       'ease',
    'in':             'ease-in',
    'out':            'ease-out',
    'in-out':         'ease-in-out',
    'snap':           'cubic-bezier(0,1,.5,1)',
    // Penner equations
    'easeInCubic':    'cubic-bezier(.550,.055,.675,.190)',
    'easeOutCubic':   'cubic-bezier(.215,.61,.355,1)',
    'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
    'easeInCirc':     'cubic-bezier(.6,.04,.98,.335)',
    'easeOutCirc':    'cubic-bezier(.075,.82,.165,1)',
    'easeInOutCirc':  'cubic-bezier(.785,.135,.15,.86)',
    'easeInExpo':     'cubic-bezier(.95,.05,.795,.035)',
    'easeOutExpo':    'cubic-bezier(.19,1,.22,1)',
    'easeInOutExpo':  'cubic-bezier(1,0,0,1)',
    'easeInQuad':     'cubic-bezier(.55,.085,.68,.53)',
    'easeOutQuad':    'cubic-bezier(.25,.46,.45,.94)',
    'easeInOutQuad':  'cubic-bezier(.455,.03,.515,.955)',
    'easeInQuart':    'cubic-bezier(.895,.03,.685,.22)',
    'easeOutQuart':   'cubic-bezier(.165,.84,.44,1)',
    'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
    'easeInQuint':    'cubic-bezier(.755,.05,.855,.06)',
    'easeOutQuint':   'cubic-bezier(.23,1,.32,1)',
    'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
    'easeInSine':     'cubic-bezier(.47,0,.745,.715)',
    'easeOutSine':    'cubic-bezier(.39,.575,.565,1)',
    'easeInOutSine':  'cubic-bezier(.445,.05,.55,.95)',
    'easeInBack':     'cubic-bezier(.6,-.28,.735,.045)',
    'easeOutBack':    'cubic-bezier(.175, .885,.32,1.275)',
    'easeInOutBack':  'cubic-bezier(.68,-.55,.265,1.55)'
  };

  // ## 'transform' CSS hook
  // Allows you to use the `transform` property in CSS.
  //
  //     $("#hello").css({ transform: "rotate(90deg)" });
  //
  //     $("#hello").css('transform');
  //     //=> { rotate: '90deg' }
  //
  $.cssHooks['transit:transform'] = {
    // The getter returns a `Transform` object.
    get: function(elem) {
      return $(elem).data('transform') || new Transform();
    },

    // The setter accepts a `Transform` object or a string.
    set: function(elem, v) {
      var value = v;

      if (!(value instanceof Transform)) {
        value = new Transform(value);
      }

      // We've seen the 3D version of Scale() not work in Chrome when the
      // element being scaled extends outside of the viewport.  Thus, we're
      // forcing Chrome to not use the 3d transforms as well.  Not sure if
      // translate is affectede, but not risking it.  Detection code from
      // http://davidwalsh.name/detecting-google-chrome-javascript
      if (support.transform === 'WebkitTransform' && !isChrome) {
        elem.style[support.transform] = value.toString(true);
      } else {
        elem.style[support.transform] = value.toString();
      }

      $(elem).data('transform', value);
    }
  };

  // Add a CSS hook for `.css({ transform: '...' })`.
  // In jQuery 1.8+, this will intentionally override the default `transform`
  // CSS hook so it'll play well with Transit. (see issue #62)
  $.cssHooks.transform = {
    set: $.cssHooks['transit:transform'].set
  };

  // ## 'filter' CSS hook
  // Allows you to use the `filter` property in CSS.
  //
  //     $("#hello").css({ filter: 'blur(10px)' });
  //
  $.cssHooks.filter = {
    get: function(elem) {
      return elem.style[support.filter];
    },
    set: function(elem, value) {
      elem.style[support.filter] = value;
    }
  };

  // jQuery 1.8+ supports prefix-free transitions, so these polyfills will not
  // be necessary.
  if ($.fn.jquery < "1.8") {
    // ## 'transformOrigin' CSS hook
    // Allows the use for `transformOrigin` to define where scaling and rotation
    // is pivoted.
    //
    //     $("#hello").css({ transformOrigin: '0 0' });
    //
    $.cssHooks.transformOrigin = {
      get: function(elem) {
        return elem.style[support.transformOrigin];
      },
      set: function(elem, value) {
        elem.style[support.transformOrigin] = value;
      }
    };

    // ## 'transition' CSS hook
    // Allows you to use the `transition` property in CSS.
    //
    //     $("#hello").css({ transition: 'all 0 ease 0' });
    //
    $.cssHooks.transition = {
      get: function(elem) {
        return elem.style[support.transition];
      },
      set: function(elem, value) {
        elem.style[support.transition] = value;
      }
    };
  }

  // ## Other CSS hooks
  // Allows you to rotate, scale and translate.
  registerCssHook('scale');
  registerCssHook('scaleX');
  registerCssHook('scaleY');
  registerCssHook('translate');
  registerCssHook('rotate');
  registerCssHook('rotateX');
  registerCssHook('rotateY');
  registerCssHook('rotate3d');
  registerCssHook('perspective');
  registerCssHook('skewX');
  registerCssHook('skewY');
  registerCssHook('x', true);
  registerCssHook('y', true);

  // ## Transform class
  // This is the main class of a transformation property that powers
  // `$.fn.css({ transform: '...' })`.
  //
  // This is, in essence, a dictionary object with key/values as `-transform`
  // properties.
  //
  //     var t = new Transform("rotate(90) scale(4)");
  //
  //     t.rotate             //=> "90deg"
  //     t.scale              //=> "4,4"
  //
  // Setters are accounted for.
  //
  //     t.set('rotate', 4)
  //     t.rotate             //=> "4deg"
  //
  // Convert it to a CSS string using the `toString()` and `toString(true)` (for WebKit)
  // functions.
  //
  //     t.toString()         //=> "rotate(90deg) scale(4,4)"
  //     t.toString(true)     //=> "rotate(90deg) scale3d(4,4,0)" (WebKit version)
  //
  function Transform(str) {
    if (typeof str === 'string') { this.parse(str); }
    return this;
  }

  Transform.prototype = {
    // ### setFromString()
    // Sets a property from a string.
    //
    //     t.setFromString('scale', '2,4');
    //     // Same as set('scale', '2', '4');
    //
    setFromString: function(prop, val) {
      var args =
        (typeof val === 'string')  ? val.split(',') :
        (val.constructor === Array) ? val :
        [ val ];

      args.unshift(prop);

      Transform.prototype.set.apply(this, args);
    },

    // ### set()
    // Sets a property.
    //
    //     t.set('scale', 2, 4);
    //
    set: function(prop) {
      var args = Array.prototype.slice.apply(arguments, [1]);
      if (this.setter[prop]) {
        this.setter[prop].apply(this, args);
      } else {
        this[prop] = args.join(',');
      }
    },

    get: function(prop) {
      if (this.getter[prop]) {
        return this.getter[prop].apply(this);
      } else {
        return this[prop] || 0;
      }
    },

    setter: {
      // ### rotate
      //
      //     .css({ rotate: 30 })
      //     .css({ rotate: "30" })
      //     .css({ rotate: "30deg" })
      //     .css({ rotate: "30deg" })
      //
      rotate: function(theta) {
        this.rotate = unit(theta, 'deg');
      },

      rotateX: function(theta) {
        this.rotateX = unit(theta, 'deg');
      },

      rotateY: function(theta) {
        this.rotateY = unit(theta, 'deg');
      },

      // ### scale
      //
      //     .css({ scale: 9 })      //=> "scale(9,9)"
      //     .css({ scale: '3,2' })  //=> "scale(3,2)"
      //
      scale: function(x, y) {
        if (y === undefined) { y = x; }
        this.scale = x + "," + y;
      },

      // ### skewX + skewY
      skewX: function(x) {
        this.skewX = unit(x, 'deg');
      },

      skewY: function(y) {
        this.skewY = unit(y, 'deg');
      },

      // ### perspectvie
      perspective: function(dist) {
        this.perspective = unit(dist, 'px');
      },

      // ### x / y
      // Translations. Notice how this keeps the other value.
      //
      //     .css({ x: 4 })       //=> "translate(4px, 0)"
      //     .css({ y: 10 })      //=> "translate(4px, 10px)"
      //
      x: function(x) {
        this.set('translate', x, null);
      },

      y: function(y) {
        this.set('translate', null, y);
      },

      // ### translate
      // Notice how this keeps the other value.
      //
      //     .css({ translate: '2, 5' })    //=> "translate(2px, 5px)"
      //
      translate: function(x, y) {
        if (this._translateX === undefined) { this._translateX = 0; }
        if (this._translateY === undefined) { this._translateY = 0; }

        if (x !== null && x !== undefined) { this._translateX = unit(x, 'px'); }
        if (y !== null && y !== undefined) { this._translateY = unit(y, 'px'); }

        this.translate = this._translateX + "," + this._translateY;
      }
    },

    getter: {
      x: function() {
        return this._translateX || 0;
      },

      y: function() {
        return this._translateY || 0;
      },

      scale: function() {
        var s = (this.scale || "1,1").split(',');
        if (s[0]) { s[0] = parseFloat(s[0]); }
        if (s[1]) { s[1] = parseFloat(s[1]); }

        // "2.5,2.5" => 2.5
        // "2.5,1" => [2.5,1]
        return (s[0] === s[1]) ? s[0] : s;
      },

      rotate3d: function() {
        var s = (this.rotate3d || "0,0,0,0deg").split(',');
        for (var i=0; i<=3; ++i) {
          if (s[i]) { s[i] = parseFloat(s[i]); }
        }
        if (s[3]) { s[3] = unit(s[3], 'deg'); }

        return s;
      }
    },

    // ### parse()
    // Parses from a string. Called on constructor.
    parse: function(str) {
      var self = this;
      str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(x, prop, val) {
        self.setFromString(prop, val);
      });
    },

    // ### toString()
    // Converts to a `transition` CSS property string. If `use3d` is given,
    // it converts to a `-webkit-transition` CSS property string instead.
    toString: function(use3d) {
      var re = [];

      for (var i in this) {
        if (this.hasOwnProperty(i)) {
          // Don't use 3D transformations if the browser can't support it.
          if ((!support.transform3d) && (
            (i === 'rotateX') ||
            (i === 'rotateY') ||
            (i === 'perspective') ||
            (i === 'transformOrigin'))) { continue; }

          if (i[0] !== '_') {
            if (use3d && (i === 'scale')) {
              re.push(i + "3d(" + this[i] + ",1)");
            } else if (use3d && (i === 'translate')) {
              re.push(i + "3d(" + this[i] + ",0)");
            } else {
              re.push(i + "(" + this[i] + ")");
            }
          }
        }
      }

      return re.join(" ");
    }
  };

  function callOrQueue(self, queue, fn) {
    if (queue === true) {
      self.queue(fn);
    } else if (queue) {
      self.queue(queue, fn);
    } else {
      self.each(function () {
                fn.call(this);
            });
    }
  }

  // ### getProperties(dict)
  // Returns properties (for `transition-property`) for dictionary `props`. The
  // value of `props` is what you would expect in `$.css(...)`.
  function getProperties(props) {
    var re = [];

    $.each(props, function(key) {
      key = $.camelCase(key); // Convert "text-align" => "textAlign"
      key = $.transit.propertyMap[key] || $.cssProps[key] || key;
      key = uncamel(key); // Convert back to dasherized

      // Get vendor specify propertie
      if (support[key])
        key = uncamel(support[key]);

      if ($.inArray(key, re) === -1) { re.push(key); }
    });

    return re;
  }

  // ### getTransition()
  // Returns the transition string to be used for the `transition` CSS property.
  //
  // Example:
  //
  //     getTransition({ opacity: 1, rotate: 30 }, 500, 'ease');
  //     //=> 'opacity 500ms ease, -webkit-transform 500ms ease'
  //
  function getTransition(properties, duration, easing, delay) {
    // Get the CSS properties needed.
    var props = getProperties(properties);

    // Account for aliases (`in` => `ease-in`).
    if ($.cssEase[easing]) { easing = $.cssEase[easing]; }

    // Build the duration/easing/delay attributes for it.
    var attribs = '' + toMS(duration) + ' ' + easing;
    if (parseInt(delay, 10) > 0) { attribs += ' ' + toMS(delay); }

    // For more properties, add them this way:
    // "margin 200ms ease, padding 200ms ease, ..."
    var transitions = [];
    $.each(props, function(i, name) {
      transitions.push(name + ' ' + attribs);
    });

    return transitions.join(', ');
  }

  // ## $.fn.transition
  // Works like $.fn.animate(), but uses CSS transitions.
  //
  //     $("...").transition({ opacity: 0.1, scale: 0.3 });
  //
  //     // Specific duration
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500);
  //
  //     // With duration and easing
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in');
  //
  //     // With callback
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, function() { ... });
  //
  //     // With everything
  //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in', function() { ... });
  //
  //     // Alternate syntax
  //     $("...").transition({
  //       opacity: 0.1,
  //       duration: 200,
  //       delay: 40,
  //       easing: 'in',
  //       complete: function() { /* ... */ }
  //      });
  //
  $.fn.transition = $.fn.transit = function(properties, duration, easing, callback) {
    var self  = this;
    var delay = 0;
    var queue = true;

    var theseProperties = $.extend(true, {}, properties);

    // Account for `.transition(properties, callback)`.
    if (typeof duration === 'function') {
      callback = duration;
      duration = undefined;
    }

    // Account for `.transition(properties, options)`.
    if (typeof duration === 'object') {
      easing = duration.easing;
      delay = duration.delay || 0;
      queue = typeof duration.queue === "undefined" ? true : duration.queue;
      callback = duration.complete;
      duration = duration.duration;
    }

    // Account for `.transition(properties, duration, callback)`.
    if (typeof easing === 'function') {
      callback = easing;
      easing = undefined;
    }

    // Alternate syntax.
    if (typeof theseProperties.easing !== 'undefined') {
      easing = theseProperties.easing;
      delete theseProperties.easing;
    }

    if (typeof theseProperties.duration !== 'undefined') {
      duration = theseProperties.duration;
      delete theseProperties.duration;
    }

    if (typeof theseProperties.complete !== 'undefined') {
      callback = theseProperties.complete;
      delete theseProperties.complete;
    }

    if (typeof theseProperties.queue !== 'undefined') {
      queue = theseProperties.queue;
      delete theseProperties.queue;
    }

    if (typeof theseProperties.delay !== 'undefined') {
      delay = theseProperties.delay;
      delete theseProperties.delay;
    }

    // Set defaults. (`400` duration, `ease` easing)
    if (typeof duration === 'undefined') { duration = $.fx.speeds._default; }
    if (typeof easing === 'undefined')   { easing = $.cssEase._default; }

    duration = toMS(duration);

    // Build the `transition` property.
    var transitionValue = getTransition(theseProperties, duration, easing, delay);

    // Compute delay until callback.
    // If this becomes 0, don't bother setting the transition property.
    var work = $.transit.enabled && support.transition;
    var i = work ? (parseInt(duration, 10) + parseInt(delay, 10)) : 0;

    // If there's nothing to do...
    if (i === 0) {
      var fn = function(next) {
        self.css(theseProperties);
        if (callback) { callback.apply(self); }
        if (next) { next(); }
      };

      callOrQueue(self, queue, fn);
      return self;
    }

    // Save the old transitions of each element so we can restore it later.
    var oldTransitions = {};

    var run = function(nextCall) {
      var bound = false;

      // Prepare the callback.
      var cb = function() {
        if (bound) { self.unbind(transitionEnd, cb); }

        if (i > 0) {
          self.each(function() {
            this.style[support.transition] = (oldTransitions[this] || null);
          });
        }

        if (typeof callback === 'function') { callback.apply(self); }
        if (typeof nextCall === 'function') { nextCall(); }
      };

      if ((i > 0) && (transitionEnd) && ($.transit.useTransitionEnd)) {
        // Use the 'transitionend' event if it's available.
        bound = true;
        self.bind(transitionEnd, cb);
      } else {
        // Fallback to timers if the 'transitionend' event isn't supported.
        window.setTimeout(cb, i);
      }

      // Apply transitions.
      self.each(function() {
        if (i > 0) {
          this.style[support.transition] = transitionValue;
        }
        $(this).css(theseProperties);
      });
    };

    // Defer running. This allows the browser to paint any pending CSS it hasn't
    // painted yet before doing the transitions.
    var deferredRun = function(next) {
        this.offsetWidth; // force a repaint
        run(next);
    };

    // Use jQuery's fx queue.
    callOrQueue(self, queue, deferredRun);

    // Chainability.
    return this;
  };

  function registerCssHook(prop, isPixels) {
    // For certain properties, the 'px' should not be implied.
    if (!isPixels) { $.cssNumber[prop] = true; }

    $.transit.propertyMap[prop] = support.transform;

    $.cssHooks[prop] = {
      get: function(elem) {
        var t = $(elem).css('transit:transform');
        return t.get(prop);
      },

      set: function(elem, value) {
        var t = $(elem).css('transit:transform');
        t.setFromString(prop, value);

        $(elem).css({ 'transit:transform': t });
      }
    };

  }

  // ### uncamel(str)
  // Converts a camelcase string to a dasherized string.
  // (`marginLeft` => `margin-left`)
  function uncamel(str) {
    return str.replace(/([A-Z])/g, function(letter) { return '-' + letter.toLowerCase(); });
  }

  // ### unit(number, unit)
  // Ensures that number `number` has a unit. If no unit is found, assume the
  // default is `unit`.
  //
  //     unit(2, 'px')          //=> "2px"
  //     unit("30deg", 'rad')   //=> "30deg"
  //
  function unit(i, units) {
    if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
      return i;
    } else {
      return "" + i + units;
    }
  }

  // ### toMS(duration)
  // Converts given `duration` to a millisecond string.
  //
  // toMS('fast') => $.fx.speeds[i] => "200ms"
  // toMS('normal') //=> $.fx.speeds._default => "400ms"
  // toMS(10) //=> '10ms'
  // toMS('100ms') //=> '100ms'  
  //
  function toMS(duration) {
    var i = duration;

    // Allow string durations like 'fast' and 'slow', without overriding numeric values.
    if (typeof i === 'string' && (!i.match(/^[\-0-9\.]+/))) { i = $.fx.speeds[i] || $.fx.speeds._default; }

    return unit(i, 'ms');
  }

  // Export some functions for testable-ness.
  $.transit.getTransitionValue = getTransition;

  return $;
}));

/*! Magnific Popup - v0.9.9 - 2014-09-06
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2014 Dmitry Semenov; */
(function(e){var t,n,i,o,r,a,s,l="Close",c="BeforeClose",d="AfterClose",u="BeforeAppend",p="MarkupParse",f="Open",m="Change",g="mfp",h="."+g,v="mfp-ready",C="mfp-removing",y="mfp-prevent-close",w=function(){},b=!!window.jQuery,I=e(window),x=function(e,n){t.ev.on(g+e+h,n)},k=function(t,n,i,o){var r=document.createElement("div");return r.className="mfp-"+t,i&&(r.innerHTML=i),o?n&&n.appendChild(r):(r=e(r),n&&r.appendTo(n)),r},T=function(n,i){t.ev.triggerHandler(g+n,i),t.st.callbacks&&(n=n.charAt(0).toLowerCase()+n.slice(1),t.st.callbacks[n]&&t.st.callbacks[n].apply(t,e.isArray(i)?i:[i]))},E=function(n){return n===s&&t.currTemplate.closeBtn||(t.currTemplate.closeBtn=e(t.st.closeMarkup.replace("%title%",t.st.tClose)),s=n),t.currTemplate.closeBtn},_=function(){e.magnificPopup.instance||(t=new w,t.init(),e.magnificPopup.instance=t)},S=function(){var e=document.createElement("p").style,t=["ms","O","Moz","Webkit"];if(void 0!==e.transition)return!0;for(;t.length;)if(t.pop()+"Transition"in e)return!0;return!1};w.prototype={constructor:w,init:function(){var n=navigator.appVersion;t.isIE7=-1!==n.indexOf("MSIE 7."),t.isIE8=-1!==n.indexOf("MSIE 8."),t.isLowIE=t.isIE7||t.isIE8,t.isAndroid=/android/gi.test(n),t.isIOS=/iphone|ipad|ipod/gi.test(n),t.supportsTransition=S(),t.probablyMobile=t.isAndroid||t.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),o=e(document),t.popupsCache={}},open:function(n){i||(i=e(document.body));var r;if(n.isObj===!1){t.items=n.items.toArray(),t.index=0;var s,l=n.items;for(r=0;l.length>r;r++)if(s=l[r],s.parsed&&(s=s.el[0]),s===n.el[0]){t.index=r;break}}else t.items=e.isArray(n.items)?n.items:[n.items],t.index=n.index||0;if(t.isOpen)return t.updateItemHTML(),void 0;t.types=[],a="",t.ev=n.mainEl&&n.mainEl.length?n.mainEl.eq(0):o,n.key?(t.popupsCache[n.key]||(t.popupsCache[n.key]={}),t.currTemplate=t.popupsCache[n.key]):t.currTemplate={},t.st=e.extend(!0,{},e.magnificPopup.defaults,n),t.fixedContentPos="auto"===t.st.fixedContentPos?!t.probablyMobile:t.st.fixedContentPos,t.st.modal&&(t.st.closeOnContentClick=!1,t.st.closeOnBgClick=!1,t.st.showCloseBtn=!1,t.st.enableEscapeKey=!1),t.bgOverlay||(t.bgOverlay=k("bg").on("click"+h,function(){t.close()}),t.wrap=k("wrap").attr("tabindex",-1).on("click"+h,function(e){t._checkIfClose(e.target)&&t.close()}),t.container=k("container",t.wrap)),t.contentContainer=k("content"),t.st.preloader&&(t.preloader=k("preloader",t.container,t.st.tLoading));var c=e.magnificPopup.modules;for(r=0;c.length>r;r++){var d=c[r];d=d.charAt(0).toUpperCase()+d.slice(1),t["init"+d].call(t)}T("BeforeOpen"),t.st.showCloseBtn&&(t.st.closeBtnInside?(x(p,function(e,t,n,i){n.close_replaceWith=E(i.type)}),a+=" mfp-close-btn-in"):t.wrap.append(E())),t.st.alignTop&&(a+=" mfp-align-top"),t.fixedContentPos?t.wrap.css({overflow:t.st.overflowY,overflowX:"hidden",overflowY:t.st.overflowY}):t.wrap.css({top:I.scrollTop(),position:"absolute"}),(t.st.fixedBgPos===!1||"auto"===t.st.fixedBgPos&&!t.fixedContentPos)&&t.bgOverlay.css({height:o.height(),position:"absolute"}),t.st.enableEscapeKey&&o.on("keyup"+h,function(e){27===e.keyCode&&t.close()}),I.on("resize"+h,function(){t.updateSize()}),t.st.closeOnContentClick||(a+=" mfp-auto-cursor"),a&&t.wrap.addClass(a);var u=t.wH=I.height(),m={};if(t.fixedContentPos&&t._hasScrollBar(u)){var g=t._getScrollbarSize();g&&(m.marginRight=g)}t.fixedContentPos&&(t.isIE7?e("body, html").css("overflow","hidden"):m.overflow="hidden");var C=t.st.mainClass;return t.isIE7&&(C+=" mfp-ie7"),C&&t._addClassToMFP(C),t.updateItemHTML(),T("BuildControls"),e("html").css(m),t.bgOverlay.add(t.wrap).prependTo(t.st.prependTo||i),t._lastFocusedEl=document.activeElement,setTimeout(function(){t.content?(t._addClassToMFP(v),t._setFocus()):t.bgOverlay.addClass(v),o.on("focusin"+h,t._onFocusIn)},16),t.isOpen=!0,t.updateSize(u),T(f),n},close:function(){t.isOpen&&(T(c),t.isOpen=!1,t.st.removalDelay&&!t.isLowIE&&t.supportsTransition?(t._addClassToMFP(C),setTimeout(function(){t._close()},t.st.removalDelay)):t._close())},_close:function(){T(l);var n=C+" "+v+" ";if(t.bgOverlay.detach(),t.wrap.detach(),t.container.empty(),t.st.mainClass&&(n+=t.st.mainClass+" "),t._removeClassFromMFP(n),t.fixedContentPos){var i={marginRight:""};t.isIE7?e("body, html").css("overflow",""):i.overflow="",e("html").css(i)}o.off("keyup"+h+" focusin"+h),t.ev.off(h),t.wrap.attr("class","mfp-wrap").removeAttr("style"),t.bgOverlay.attr("class","mfp-bg"),t.container.attr("class","mfp-container"),!t.st.showCloseBtn||t.st.closeBtnInside&&t.currTemplate[t.currItem.type]!==!0||t.currTemplate.closeBtn&&t.currTemplate.closeBtn.detach(),t._lastFocusedEl&&e(t._lastFocusedEl).focus(),t.currItem=null,t.content=null,t.currTemplate=null,t.prevHeight=0,T(d)},updateSize:function(e){if(t.isIOS){var n=document.documentElement.clientWidth/window.innerWidth,i=window.innerHeight*n;t.wrap.css("height",i),t.wH=i}else t.wH=e||I.height();t.fixedContentPos||t.wrap.css("height",t.wH),T("Resize")},updateItemHTML:function(){var n=t.items[t.index];t.contentContainer.detach(),t.content&&t.content.detach(),n.parsed||(n=t.parseEl(t.index));var i=n.type;if(T("BeforeChange",[t.currItem?t.currItem.type:"",i]),t.currItem=n,!t.currTemplate[i]){var o=t.st[i]?t.st[i].markup:!1;T("FirstMarkupParse",o),t.currTemplate[i]=o?e(o):!0}r&&r!==n.type&&t.container.removeClass("mfp-"+r+"-holder");var a=t["get"+i.charAt(0).toUpperCase()+i.slice(1)](n,t.currTemplate[i]);t.appendContent(a,i),n.preloaded=!0,T(m,n),r=n.type,t.container.prepend(t.contentContainer),T("AfterChange")},appendContent:function(e,n){t.content=e,e?t.st.showCloseBtn&&t.st.closeBtnInside&&t.currTemplate[n]===!0?t.content.find(".mfp-close").length||t.content.append(E()):t.content=e:t.content="",T(u),t.container.addClass("mfp-"+n+"-holder"),t.contentContainer.append(t.content)},parseEl:function(n){var i,o=t.items[n];if(o.tagName?o={el:e(o)}:(i=o.type,o={data:o,src:o.src}),o.el){for(var r=t.types,a=0;r.length>a;a++)if(o.el.hasClass("mfp-"+r[a])){i=r[a];break}o.src=o.el.attr("data-mfp-src"),o.src||(o.src=o.el.attr("href"))}return o.type=i||t.st.type||"inline",o.index=n,o.parsed=!0,t.items[n]=o,T("ElementParse",o),t.items[n]},addGroup:function(e,n){var i=function(i){i.mfpEl=this,t._openClick(i,e,n)};n||(n={});var o="click.magnificPopup";n.mainEl=e,n.items?(n.isObj=!0,e.off(o).on(o,i)):(n.isObj=!1,n.delegate?e.off(o).on(o,n.delegate,i):(n.items=e,e.off(o).on(o,i)))},_openClick:function(n,i,o){var r=void 0!==o.midClick?o.midClick:e.magnificPopup.defaults.midClick;if(r||2!==n.which&&!n.ctrlKey&&!n.metaKey){var a=void 0!==o.disableOn?o.disableOn:e.magnificPopup.defaults.disableOn;if(a)if(e.isFunction(a)){if(!a.call(t))return!0}else if(a>I.width())return!0;n.type&&(n.preventDefault(),t.isOpen&&n.stopPropagation()),o.el=e(n.mfpEl),o.delegate&&(o.items=i.find(o.delegate)),t.open(o)}},updateStatus:function(e,i){if(t.preloader){n!==e&&t.container.removeClass("mfp-s-"+n),i||"loading"!==e||(i=t.st.tLoading);var o={status:e,text:i};T("UpdateStatus",o),e=o.status,i=o.text,t.preloader.html(i),t.preloader.find("a").on("click",function(e){e.stopImmediatePropagation()}),t.container.addClass("mfp-s-"+e),n=e}},_checkIfClose:function(n){if(!e(n).hasClass(y)){var i=t.st.closeOnContentClick,o=t.st.closeOnBgClick;if(i&&o)return!0;if(!t.content||e(n).hasClass("mfp-close")||t.preloader&&n===t.preloader[0])return!0;if(n===t.content[0]||e.contains(t.content[0],n)){if(i)return!0}else if(o&&e.contains(document,n))return!0;return!1}},_addClassToMFP:function(e){t.bgOverlay.addClass(e),t.wrap.addClass(e)},_removeClassFromMFP:function(e){this.bgOverlay.removeClass(e),t.wrap.removeClass(e)},_hasScrollBar:function(e){return(t.isIE7?o.height():document.body.scrollHeight)>(e||I.height())},_setFocus:function(){(t.st.focus?t.content.find(t.st.focus).eq(0):t.wrap).focus()},_onFocusIn:function(n){return n.target===t.wrap[0]||e.contains(t.wrap[0],n.target)?void 0:(t._setFocus(),!1)},_parseMarkup:function(t,n,i){var o;i.data&&(n=e.extend(i.data,n)),T(p,[t,n,i]),e.each(n,function(e,n){if(void 0===n||n===!1)return!0;if(o=e.split("_"),o.length>1){var i=t.find(h+"-"+o[0]);if(i.length>0){var r=o[1];"replaceWith"===r?i[0]!==n[0]&&i.replaceWith(n):"img"===r?i.is("img")?i.attr("src",n):i.replaceWith('<img src="'+n+'" class="'+i.attr("class")+'" />'):i.attr(o[1],n)}}else t.find(h+"-"+e).html(n)})},_getScrollbarSize:function(){if(void 0===t.scrollbarSize){var e=document.createElement("div");e.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(e),t.scrollbarSize=e.offsetWidth-e.clientWidth,document.body.removeChild(e)}return t.scrollbarSize}},e.magnificPopup={instance:null,proto:w.prototype,modules:[],open:function(t,n){return _(),t=t?e.extend(!0,{},t):{},t.isObj=!0,t.index=n||0,this.instance.open(t)},close:function(){return e.magnificPopup.instance&&e.magnificPopup.instance.close()},registerModule:function(t,n){n.options&&(e.magnificPopup.defaults[t]=n.options),e.extend(this.proto,n.proto),this.modules.push(t)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeOnBgClick:!0,closeBtnInside:!0,showCloseBtn:!0,enableEscapeKey:!0,modal:!1,alignTop:!1,removalDelay:0,prependTo:null,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&times;</button>',tClose:"Close (Esc)",tLoading:"Loading..."}},e.fn.magnificPopup=function(n){_();var i=e(this);if("string"==typeof n)if("open"===n){var o,r=b?i.data("magnificPopup"):i[0].magnificPopup,a=parseInt(arguments[1],10)||0;r.items?o=r.items[a]:(o=i,r.delegate&&(o=o.find(r.delegate)),o=o.eq(a)),t._openClick({mfpEl:o},i,r)}else t.isOpen&&t[n].apply(t,Array.prototype.slice.call(arguments,1));else n=e.extend(!0,{},n),b?i.data("magnificPopup",n):i[0].magnificPopup=n,t.addGroup(i,n);return i};var P,O,z,M="inline",B=function(){z&&(O.after(z.addClass(P)).detach(),z=null)};e.magnificPopup.registerModule(M,{options:{hiddenClass:"hide",markup:"",tNotFound:"Content not found"},proto:{initInline:function(){t.types.push(M),x(l+"."+M,function(){B()})},getInline:function(n,i){if(B(),n.src){var o=t.st.inline,r=e(n.src);if(r.length){var a=r[0].parentNode;a&&a.tagName&&(O||(P=o.hiddenClass,O=k(P),P="mfp-"+P),z=r.after(O).detach().removeClass(P)),t.updateStatus("ready")}else t.updateStatus("error",o.tNotFound),r=e("<div>");return n.inlineElement=r,r}return t.updateStatus("ready"),t._parseMarkup(i,{},n),i}}});var F,H="ajax",L=function(){F&&i.removeClass(F)},A=function(){L(),t.req&&t.req.abort()};e.magnificPopup.registerModule(H,{options:{settings:null,cursor:"mfp-ajax-cur",tError:'<a href="%url%">The content</a> could not be loaded.'},proto:{initAjax:function(){t.types.push(H),F=t.st.ajax.cursor,x(l+"."+H,A),x("BeforeChange."+H,A)},getAjax:function(n){F&&i.addClass(F),t.updateStatus("loading");var o=e.extend({url:n.src,success:function(i,o,r){var a={data:i,xhr:r};T("ParseAjax",a),t.appendContent(e(a.data),H),n.finished=!0,L(),t._setFocus(),setTimeout(function(){t.wrap.addClass(v)},16),t.updateStatus("ready"),T("AjaxContentAdded")},error:function(){L(),n.finished=n.loadError=!0,t.updateStatus("error",t.st.ajax.tError.replace("%url%",n.src))}},t.st.ajax.settings);return t.req=e.ajax(o),""}}});var j,N=function(n){if(n.data&&void 0!==n.data.title)return n.data.title;var i=t.st.image.titleSrc;if(i){if(e.isFunction(i))return i.call(t,n);if(n.el)return n.el.attr(i)||""}return""};e.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var e=t.st.image,n=".image";t.types.push("image"),x(f+n,function(){"image"===t.currItem.type&&e.cursor&&i.addClass(e.cursor)}),x(l+n,function(){e.cursor&&i.removeClass(e.cursor),I.off("resize"+h)}),x("Resize"+n,t.resizeImage),t.isLowIE&&x("AfterChange",t.resizeImage)},resizeImage:function(){var e=t.currItem;if(e&&e.img&&t.st.image.verticalFit){var n=0;t.isLowIE&&(n=parseInt(e.img.css("padding-top"),10)+parseInt(e.img.css("padding-bottom"),10)),e.img.css("max-height",t.wH-n)}},_onImageHasSize:function(e){e.img&&(e.hasSize=!0,j&&clearInterval(j),e.isCheckingImgSize=!1,T("ImageHasSize",e),e.imgHidden&&(t.content&&t.content.removeClass("mfp-loading"),e.imgHidden=!1))},findImageSize:function(e){var n=0,i=e.img[0],o=function(r){j&&clearInterval(j),j=setInterval(function(){return i.naturalWidth>0?(t._onImageHasSize(e),void 0):(n>200&&clearInterval(j),n++,3===n?o(10):40===n?o(50):100===n&&o(500),void 0)},r)};o(1)},getImage:function(n,i){var o=0,r=function(){n&&(n.img[0].complete?(n.img.off(".mfploader"),n===t.currItem&&(t._onImageHasSize(n),t.updateStatus("ready")),n.hasSize=!0,n.loaded=!0,T("ImageLoadComplete")):(o++,200>o?setTimeout(r,100):a()))},a=function(){n&&(n.img.off(".mfploader"),n===t.currItem&&(t._onImageHasSize(n),t.updateStatus("error",s.tError.replace("%url%",n.src))),n.hasSize=!0,n.loaded=!0,n.loadError=!0)},s=t.st.image,l=i.find(".mfp-img");if(l.length){var c=document.createElement("img");c.className="mfp-img",n.img=e(c).on("load.mfploader",r).on("error.mfploader",a),c.src=n.src,l.is("img")&&(n.img=n.img.clone()),c=n.img[0],c.naturalWidth>0?n.hasSize=!0:c.width||(n.hasSize=!1)}return t._parseMarkup(i,{title:N(n),img_replaceWith:n.img},n),t.resizeImage(),n.hasSize?(j&&clearInterval(j),n.loadError?(i.addClass("mfp-loading"),t.updateStatus("error",s.tError.replace("%url%",n.src))):(i.removeClass("mfp-loading"),t.updateStatus("ready")),i):(t.updateStatus("loading"),n.loading=!0,n.hasSize||(n.imgHidden=!0,i.addClass("mfp-loading"),t.findImageSize(n)),i)}}});var W,R=function(){return void 0===W&&(W=void 0!==document.createElement("p").style.MozTransform),W};e.magnificPopup.registerModule("zoom",{options:{enabled:!1,easing:"ease-in-out",duration:300,opener:function(e){return e.is("img")?e:e.find("img")}},proto:{initZoom:function(){var e,n=t.st.zoom,i=".zoom";if(n.enabled&&t.supportsTransition){var o,r,a=n.duration,s=function(e){var t=e.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),i="all "+n.duration/1e3+"s "+n.easing,o={position:"fixed",zIndex:9999,left:0,top:0,"-webkit-backface-visibility":"hidden"},r="transition";return o["-webkit-"+r]=o["-moz-"+r]=o["-o-"+r]=o[r]=i,t.css(o),t},d=function(){t.content.css("visibility","visible")};x("BuildControls"+i,function(){if(t._allowZoom()){if(clearTimeout(o),t.content.css("visibility","hidden"),e=t._getItemToZoom(),!e)return d(),void 0;r=s(e),r.css(t._getOffset()),t.wrap.append(r),o=setTimeout(function(){r.css(t._getOffset(!0)),o=setTimeout(function(){d(),setTimeout(function(){r.remove(),e=r=null,T("ZoomAnimationEnded")},16)},a)},16)}}),x(c+i,function(){if(t._allowZoom()){if(clearTimeout(o),t.st.removalDelay=a,!e){if(e=t._getItemToZoom(),!e)return;r=s(e)}r.css(t._getOffset(!0)),t.wrap.append(r),t.content.css("visibility","hidden"),setTimeout(function(){r.css(t._getOffset())},16)}}),x(l+i,function(){t._allowZoom()&&(d(),r&&r.remove(),e=null)})}},_allowZoom:function(){return"image"===t.currItem.type},_getItemToZoom:function(){return t.currItem.hasSize?t.currItem.img:!1},_getOffset:function(n){var i;i=n?t.currItem.img:t.st.zoom.opener(t.currItem.el||t.currItem);var o=i.offset(),r=parseInt(i.css("padding-top"),10),a=parseInt(i.css("padding-bottom"),10);o.top-=e(window).scrollTop()-r;var s={width:i.width(),height:(b?i.innerHeight():i[0].offsetHeight)-a-r};return R()?s["-moz-transform"]=s.transform="translate("+o.left+"px,"+o.top+"px)":(s.left=o.left,s.top=o.top),s}}});var Z="iframe",q="//about:blank",D=function(e){if(t.currTemplate[Z]){var n=t.currTemplate[Z].find("iframe");n.length&&(e||(n[0].src=q),t.isIE8&&n.css("display",e?"block":"none"))}};e.magnificPopup.registerModule(Z,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){t.types.push(Z),x("BeforeChange",function(e,t,n){t!==n&&(t===Z?D():n===Z&&D(!0))}),x(l+"."+Z,function(){D()})},getIframe:function(n,i){var o=n.src,r=t.st.iframe;e.each(r.patterns,function(){return o.indexOf(this.index)>-1?(this.id&&(o="string"==typeof this.id?o.substr(o.lastIndexOf(this.id)+this.id.length,o.length):this.id.call(this,o)),o=this.src.replace("%id%",o),!1):void 0});var a={};return r.srcAction&&(a[r.srcAction]=o),t._parseMarkup(i,a,n),t.updateStatus("ready"),i}}});var K=function(e){var n=t.items.length;return e>n-1?e-n:0>e?n+e:e},Y=function(e,t,n){return e.replace(/%curr%/gi,t+1).replace(/%total%/gi,n)};e.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var n=t.st.gallery,i=".mfp-gallery",r=Boolean(e.fn.mfpFastClick);return t.direction=!0,n&&n.enabled?(a+=" mfp-gallery",x(f+i,function(){n.navigateByImgClick&&t.wrap.on("click"+i,".mfp-img",function(){return t.items.length>1?(t.next(),!1):void 0}),o.on("keydown"+i,function(e){37===e.keyCode?t.prev():39===e.keyCode&&t.next()})}),x("UpdateStatus"+i,function(e,n){n.text&&(n.text=Y(n.text,t.currItem.index,t.items.length))}),x(p+i,function(e,i,o,r){var a=t.items.length;o.counter=a>1?Y(n.tCounter,r.index,a):""}),x("BuildControls"+i,function(){if(t.items.length>1&&n.arrows&&!t.arrowLeft){var i=n.arrowMarkup,o=t.arrowLeft=e(i.replace(/%title%/gi,n.tPrev).replace(/%dir%/gi,"left")).addClass(y),a=t.arrowRight=e(i.replace(/%title%/gi,n.tNext).replace(/%dir%/gi,"right")).addClass(y),s=r?"mfpFastClick":"click";o[s](function(){t.prev()}),a[s](function(){t.next()}),t.isIE7&&(k("b",o[0],!1,!0),k("a",o[0],!1,!0),k("b",a[0],!1,!0),k("a",a[0],!1,!0)),t.container.append(o.add(a))}}),x(m+i,function(){t._preloadTimeout&&clearTimeout(t._preloadTimeout),t._preloadTimeout=setTimeout(function(){t.preloadNearbyImages(),t._preloadTimeout=null},16)}),x(l+i,function(){o.off(i),t.wrap.off("click"+i),t.arrowLeft&&r&&t.arrowLeft.add(t.arrowRight).destroyMfpFastClick(),t.arrowRight=t.arrowLeft=null}),void 0):!1},next:function(){t.direction=!0,t.index=K(t.index+1),t.updateItemHTML()},prev:function(){t.direction=!1,t.index=K(t.index-1),t.updateItemHTML()},goTo:function(e){t.direction=e>=t.index,t.index=e,t.updateItemHTML()},preloadNearbyImages:function(){var e,n=t.st.gallery.preload,i=Math.min(n[0],t.items.length),o=Math.min(n[1],t.items.length);for(e=1;(t.direction?o:i)>=e;e++)t._preloadItem(t.index+e);for(e=1;(t.direction?i:o)>=e;e++)t._preloadItem(t.index-e)},_preloadItem:function(n){if(n=K(n),!t.items[n].preloaded){var i=t.items[n];i.parsed||(i=t.parseEl(n)),T("LazyLoad",i),"image"===i.type&&(i.img=e('<img class="mfp-img" />').on("load.mfploader",function(){i.hasSize=!0}).on("error.mfploader",function(){i.hasSize=!0,i.loadError=!0,T("LazyLoadError",i)}).attr("src",i.src)),i.preloaded=!0}}}});var U="retina";e.magnificPopup.registerModule(U,{options:{replaceSrc:function(e){return e.src.replace(/\.\w+$/,function(e){return"@2x"+e})},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var e=t.st.retina,n=e.ratio;n=isNaN(n)?n():n,n>1&&(x("ImageHasSize."+U,function(e,t){t.img.css({"max-width":t.img[0].naturalWidth/n,width:"100%"})}),x("ElementParse."+U,function(t,i){i.src=e.replaceSrc(i,n)}))}}}}),function(){var t=1e3,n="ontouchstart"in window,i=function(){I.off("touchmove"+r+" touchend"+r)},o="mfpFastClick",r="."+o;e.fn.mfpFastClick=function(o){return e(this).each(function(){var a,s=e(this);if(n){var l,c,d,u,p,f;s.on("touchstart"+r,function(e){u=!1,f=1,p=e.originalEvent?e.originalEvent.touches[0]:e.touches[0],c=p.clientX,d=p.clientY,I.on("touchmove"+r,function(e){p=e.originalEvent?e.originalEvent.touches:e.touches,f=p.length,p=p[0],(Math.abs(p.clientX-c)>10||Math.abs(p.clientY-d)>10)&&(u=!0,i())}).on("touchend"+r,function(e){i(),u||f>1||(a=!0,e.preventDefault(),clearTimeout(l),l=setTimeout(function(){a=!1},t),o())})})}s.on("click"+r,function(){a||o()})})},e.fn.destroyMfpFastClick=function(){e(this).off("touchstart"+r+" click"+r),n&&I.off("touchmove"+r+" touchend"+r)}}(),_()})(window.jQuery||window.Zepto);
/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT */

;(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.NProgress = factory();
  }

})(this, function() {
  var NProgress = {};

  NProgress.version = '0.1.6';

  var Settings = NProgress.settings = {
    minimum: 0.08,
    easing: 'ease',
    positionUsing: '',
    speed: 200,
    trickle: true,
    trickleRate: 0.02,
    trickleSpeed: 800,
    showSpinner: true,
    barSelector: '[role="bar"]',
    spinnerSelector: '[role="spinner"]',
    parent: 'body',
    template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
  };

  /**
   * Updates configuration.
   *
   *     NProgress.configure({
   *       minimum: 0.1
   *     });
   */
  NProgress.configure = function(options) {
    var key, value;
    for (key in options) {
      value = options[key];
      if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
    }

    return this;
  };

  /**
   * Last number.
   */

  NProgress.status = null;

  /**
   * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
   *
   *     NProgress.set(0.4);
   *     NProgress.set(1.0);
   */

  NProgress.set = function(n) {
    var started = NProgress.isStarted();

    n = clamp(n, Settings.minimum, 1);
    NProgress.status = (n === 1 ? null : n);

    var progress = NProgress.render(!started),
        bar      = progress.querySelector(Settings.barSelector),
        speed    = Settings.speed,
        ease     = Settings.easing;

    progress.offsetWidth; /* Repaint */

    queue(function(next) {
      // Set positionUsing if it hasn't already been set
      if (Settings.positionUsing === '') Settings.positionUsing = NProgress.getPositioningCSS();

      // Add transition
      css(bar, barPositionCSS(n, speed, ease));

      if (n === 1) {
        // Fade out
        css(progress, { 
          transition: 'none', 
          opacity: 1 
        });
        progress.offsetWidth; /* Repaint */

        setTimeout(function() {
          css(progress, { 
            transition: 'all ' + speed + 'ms linear', 
            opacity: 0 
          });
          setTimeout(function() {
            NProgress.remove();
            next();
          }, speed);
        }, speed);
      } else {
        setTimeout(next, speed);
      }
    });

    return this;
  };

  NProgress.isStarted = function() {
    return typeof NProgress.status === 'number';
  };

  /**
   * Shows the progress bar.
   * This is the same as setting the status to 0%, except that it doesn't go backwards.
   *
   *     NProgress.start();
   *
   */
  NProgress.start = function() {
    if (!NProgress.status) NProgress.set(0);

    var work = function() {
      setTimeout(function() {
        if (!NProgress.status) return;
        NProgress.trickle();
        work();
      }, Settings.trickleSpeed);
    };

    if (Settings.trickle) work();

    return this;
  };

  /**
   * Hides the progress bar.
   * This is the *sort of* the same as setting the status to 100%, with the
   * difference being `done()` makes some placebo effect of some realistic motion.
   *
   *     NProgress.done();
   *
   * If `true` is passed, it will show the progress bar even if its hidden.
   *
   *     NProgress.done(true);
   */

  NProgress.done = function(force) {
    if (!force && !NProgress.status) return this;

    return NProgress.inc(0.3 + 0.5 * Math.random()).set(1);
  };

  /**
   * Increments by a random amount.
   */

  NProgress.inc = function(amount) {
    var n = NProgress.status;

    if (!n) {
      return NProgress.start();
    } else {
      if (typeof amount !== 'number') {
        amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
      }

      n = clamp(n + amount, 0, 0.994);
      return NProgress.set(n);
    }
  };

  NProgress.trickle = function() {
    return NProgress.inc(Math.random() * Settings.trickleRate);
  };

  /**
   * Waits for all supplied jQuery promises and
   * increases the progress as the promises resolve.
   * 
   * @param $promise jQUery Promise
   */
  (function() {
    var initial = 0, current = 0;
    
    NProgress.promise = function($promise) {
      if (!$promise || $promise.state() == "resolved") {
        return this;
      }
      
      if (current == 0) {
        NProgress.start();
      }
      
      initial++;
      current++;
      
      $promise.always(function() {
        current--;
        if (current == 0) {
            initial = 0;
            NProgress.done();
        } else {
            NProgress.set((initial - current) / initial);
        }
      });
      
      return this;
    };
    
  })();

  /**
   * (Internal) renders the progress bar markup based on the `template`
   * setting.
   */

  NProgress.render = function(fromStart) {
    if (NProgress.isRendered()) return document.getElementById('nprogress');

    addClass(document.documentElement, 'nprogress-busy');
    
    var progress = document.createElement('div');
    progress.id = 'nprogress';
    progress.innerHTML = Settings.template;

    var bar      = progress.querySelector(Settings.barSelector),
        perc     = fromStart ? '-100' : toBarPerc(NProgress.status || 0),
        parent   = document.querySelector(Settings.parent),
        spinner;
    
    css(bar, {
      transition: 'all 0 linear',
      transform: 'translate3d(' + perc + '%,0,0)'
    });

    if (!Settings.showSpinner) {
      spinner = progress.querySelector(Settings.spinnerSelector);
      spinner && removeElement(spinner);
    }

    if (parent != document.body) {
      addClass(parent, 'nprogress-custom-parent');
    }

    parent.appendChild(progress);
    return progress;
  };

  /**
   * Removes the element. Opposite of render().
   */

  NProgress.remove = function() {
    removeClass(document.documentElement, 'nprogress-busy');
    removeClass(document.querySelector(Settings.parent), 'nprogress-custom-parent')
    var progress = document.getElementById('nprogress');
    progress && removeElement(progress);
  };

  /**
   * Checks if the progress bar is rendered.
   */

  NProgress.isRendered = function() {
    return !!document.getElementById('nprogress');
  };

  /**
   * Determine which positioning CSS rule to use.
   */

  NProgress.getPositioningCSS = function() {
    // Sniff on document.body.style
    var bodyStyle = document.body.style;

    // Sniff prefixes
    var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
                       ('MozTransform' in bodyStyle) ? 'Moz' :
                       ('msTransform' in bodyStyle) ? 'ms' :
                       ('OTransform' in bodyStyle) ? 'O' : '';

    if (vendorPrefix + 'Perspective' in bodyStyle) {
      // Modern browsers with 3D support, e.g. Webkit, IE10
      return 'translate3d';
    } else if (vendorPrefix + 'Transform' in bodyStyle) {
      // Browsers without 3D support, e.g. IE9
      return 'translate';
    } else {
      // Browsers without translate() support, e.g. IE7-8
      return 'margin';
    }
  };

  /**
   * Helpers
   */

  function clamp(n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  /**
   * (Internal) converts a percentage (`0..1`) to a bar translateX
   * percentage (`-100%..0%`).
   */

  function toBarPerc(n) {
    return (-1 + n) * 100;
  }


  /**
   * (Internal) returns the correct CSS for changing the bar's
   * position given an n percentage, and speed and ease from Settings
   */

  function barPositionCSS(n, speed, ease) {
    var barCSS;

    if (Settings.positionUsing === 'translate3d') {
      barCSS = { transform: 'translate3d('+toBarPerc(n)+'%,0,0)' };
    } else if (Settings.positionUsing === 'translate') {
      barCSS = { transform: 'translate('+toBarPerc(n)+'%,0)' };
    } else {
      barCSS = { 'margin-left': toBarPerc(n)+'%' };
    }

    barCSS.transition = 'all '+speed+'ms '+ease;

    return barCSS;
  }

  /**
   * (Internal) Queues a function to be executed.
   */

  var queue = (function() {
    var pending = [];
    
    function next() {
      var fn = pending.shift();
      if (fn) {
        fn(next);
      }
    }

    return function(fn) {
      pending.push(fn);
      if (pending.length == 1) next();
    };
  })();

  /**
   * (Internal) Applies css properties to an element, similar to the jQuery 
   * css method.
   *
   * While this helper does assist with vendor prefixed property names, it 
   * does not perform any manipulation of values prior to setting styles.
   */

  var css = (function() {
    var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],
        cssProps    = {};

    function camelCase(string) {
      return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
        return letter.toUpperCase();
      });
    }

    function getVendorProp(name) {
      var style = document.body.style;
      if (name in style) return name;

      var i = cssPrefixes.length,
          capName = name.charAt(0).toUpperCase() + name.slice(1),
          vendorName;
      while (i--) {
        vendorName = cssPrefixes[i] + capName;
        if (vendorName in style) return vendorName;
      }

      return name;
    }

    function getStyleProp(name) {
      name = camelCase(name);
      return cssProps[name] || (cssProps[name] = getVendorProp(name));
    }

    function applyCss(element, prop, value) {
      prop = getStyleProp(prop);
      element.style[prop] = value;
    }

    return function(element, properties) {
      var args = arguments,
          prop, 
          value;

      if (args.length == 2) {
        for (prop in properties) {
          value = properties[prop];
          if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
        }
      } else {
        applyCss(element, args[1], args[2]);
      }
    }
  })();

  /**
   * (Internal) Determines if an element or space separated list of class names contains a class name.
   */

  function hasClass(element, name) {
    var list = typeof element == 'string' ? element : classList(element);
    return list.indexOf(' ' + name + ' ') >= 0;
  }

  /**
   * (Internal) Adds a class to an element.
   */

  function addClass(element, name) {
    var oldList = classList(element),
        newList = oldList + name;

    if (hasClass(oldList, name)) return; 

    // Trim the opening space.
    element.className = newList.substring(1);
  }

  /**
   * (Internal) Removes a class from an element.
   */

  function removeClass(element, name) {
    var oldList = classList(element),
        newList;

    if (!hasClass(element, name)) return;

    // Replace the class name.
    newList = oldList.replace(' ' + name + ' ', ' ');

    // Trim the opening and closing spaces.
    element.className = newList.substring(1, newList.length - 1);
  }

  /**
   * (Internal) Gets a space separated list of the class names on the element. 
   * The list is wrapped with a single space on each end to facilitate finding 
   * matches within the list.
   */

  function classList(element) {
    return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
  }

  /**
   * (Internal) Removes an element from the DOM.
   */

  function removeElement(element) {
    element && element.parentNode && element.parentNode.removeChild(element);
  }

  return NProgress;
});


/*! WOW - v1.0.2 - 2014-09-24
* Copyright (c) 2014 Matthieu Aussaguel; Licensed MIT */(function(){var a,b,c,d,e,f=function(a,b){return function(){return a.apply(b,arguments)}},g=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};b=function(){function a(){}return a.prototype.extend=function(a,b){var c,d;for(c in b)d=b[c],null==a[c]&&(a[c]=d);return a},a.prototype.isMobile=function(a){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a)},a.prototype.addEvent=function(a,b,c){return null!=a.addEventListener?a.addEventListener(b,c,!1):null!=a.attachEvent?a.attachEvent("on"+b,c):a[b]=c},a.prototype.removeEvent=function(a,b,c){return null!=a.removeEventListener?a.removeEventListener(b,c,!1):null!=a.detachEvent?a.detachEvent("on"+b,c):delete a[b]},a.prototype.innerHeight=function(){return"innerHeight"in window?window.innerHeight:document.documentElement.clientHeight},a}(),c=this.WeakMap||this.MozWeakMap||(c=function(){function a(){this.keys=[],this.values=[]}return a.prototype.get=function(a){var b,c,d,e,f;for(f=this.keys,b=d=0,e=f.length;e>d;b=++d)if(c=f[b],c===a)return this.values[b]},a.prototype.set=function(a,b){var c,d,e,f,g;for(g=this.keys,c=e=0,f=g.length;f>e;c=++e)if(d=g[c],d===a)return void(this.values[c]=b);return this.keys.push(a),this.values.push(b)},a}()),a=this.MutationObserver||this.WebkitMutationObserver||this.MozMutationObserver||(a=function(){function a(){"undefined"!=typeof console&&null!==console&&console.warn("MutationObserver is not supported by your browser."),"undefined"!=typeof console&&null!==console&&console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.")}return a.notSupported=!0,a.prototype.observe=function(){},a}()),d=this.getComputedStyle||function(a){return this.getPropertyValue=function(b){var c;return"float"===b&&(b="styleFloat"),e.test(b)&&b.replace(e,function(a,b){return b.toUpperCase()}),(null!=(c=a.currentStyle)?c[b]:void 0)||null},this},e=/(\-([a-z]){1})/g,this.WOW=function(){function e(a){null==a&&(a={}),this.scrollCallback=f(this.scrollCallback,this),this.scrollHandler=f(this.scrollHandler,this),this.start=f(this.start,this),this.scrolled=!0,this.config=this.util().extend(a,this.defaults),this.animationNameCache=new c}return e.prototype.defaults={boxClass:"wow",animateClass:"animated",offset:0,mobile:!0,live:!0},e.prototype.init=function(){var a;return this.element=window.document.documentElement,"interactive"===(a=document.readyState)||"complete"===a?this.start():this.util().addEvent(document,"DOMContentLoaded",this.start),this.finished=[]},e.prototype.start=function(){var b,c,d,e;if(this.stopped=!1,this.boxes=function(){var a,c,d,e;for(d=this.element.querySelectorAll("."+this.config.boxClass),e=[],a=0,c=d.length;c>a;a++)b=d[a],e.push(b);return e}.call(this),this.all=function(){var a,c,d,e;for(d=this.boxes,e=[],a=0,c=d.length;c>a;a++)b=d[a],e.push(b);return e}.call(this),this.boxes.length)if(this.disabled())this.resetStyle();else{for(e=this.boxes,c=0,d=e.length;d>c;c++)b=e[c],this.applyStyle(b,!0);this.util().addEvent(window,"scroll",this.scrollHandler),this.util().addEvent(window,"resize",this.scrollHandler),this.interval=setInterval(this.scrollCallback,50)}return this.config.live?new a(function(a){return function(b){var c,d,e,f,g;for(g=[],e=0,f=b.length;f>e;e++)d=b[e],g.push(function(){var a,b,e,f;for(e=d.addedNodes||[],f=[],a=0,b=e.length;b>a;a++)c=e[a],f.push(this.doSync(c));return f}.call(a));return g}}(this)).observe(document.body,{childList:!0,subtree:!0}):void 0},e.prototype.stop=function(){return this.stopped=!0,this.util().removeEvent(window,"scroll",this.scrollHandler),this.util().removeEvent(window,"resize",this.scrollHandler),null!=this.interval?clearInterval(this.interval):void 0},e.prototype.sync=function(){return a.notSupported?this.doSync(this.element):void 0},e.prototype.doSync=function(a){var b,c,d,e,f;if(null==a&&(a=this.element),1===a.nodeType){for(a=a.parentNode||a,e=a.querySelectorAll("."+this.config.boxClass),f=[],c=0,d=e.length;d>c;c++)b=e[c],g.call(this.all,b)<0?(this.boxes.push(b),this.all.push(b),this.stopped||this.disabled()?this.resetStyle():this.applyStyle(b,!0),f.push(this.scrolled=!0)):f.push(void 0);return f}},e.prototype.show=function(a){return this.applyStyle(a),a.className=""+a.className+" "+this.config.animateClass},e.prototype.applyStyle=function(a,b){var c,d,e;return d=a.getAttribute("data-wow-duration"),c=a.getAttribute("data-wow-delay"),e=a.getAttribute("data-wow-iteration"),this.animate(function(f){return function(){return f.customStyle(a,b,d,c,e)}}(this))},e.prototype.animate=function(){return"requestAnimationFrame"in window?function(a){return window.requestAnimationFrame(a)}:function(a){return a()}}(),e.prototype.resetStyle=function(){var a,b,c,d,e;for(d=this.boxes,e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(a.style.visibility="visible");return e},e.prototype.customStyle=function(a,b,c,d,e){return b&&this.cacheAnimationName(a),a.style.visibility=b?"hidden":"visible",c&&this.vendorSet(a.style,{animationDuration:c}),d&&this.vendorSet(a.style,{animationDelay:d}),e&&this.vendorSet(a.style,{animationIterationCount:e}),this.vendorSet(a.style,{animationName:b?"none":this.cachedAnimationName(a)}),a},e.prototype.vendors=["moz","webkit"],e.prototype.vendorSet=function(a,b){var c,d,e,f;f=[];for(c in b)d=b[c],a[""+c]=d,f.push(function(){var b,f,g,h;for(g=this.vendors,h=[],b=0,f=g.length;f>b;b++)e=g[b],h.push(a[""+e+c.charAt(0).toUpperCase()+c.substr(1)]=d);return h}.call(this));return f},e.prototype.vendorCSS=function(a,b){var c,e,f,g,h,i;for(e=d(a),c=e.getPropertyCSSValue(b),i=this.vendors,g=0,h=i.length;h>g;g++)f=i[g],c=c||e.getPropertyCSSValue("-"+f+"-"+b);return c},e.prototype.animationName=function(a){var b;try{b=this.vendorCSS(a,"animation-name").cssText}catch(c){b=d(a).getPropertyValue("animation-name")}return"none"===b?"":b},e.prototype.cacheAnimationName=function(a){return this.animationNameCache.set(a,this.animationName(a))},e.prototype.cachedAnimationName=function(a){return this.animationNameCache.get(a)},e.prototype.scrollHandler=function(){return this.scrolled=!0},e.prototype.scrollCallback=function(){var a;return!this.scrolled||(this.scrolled=!1,this.boxes=function(){var b,c,d,e;for(d=this.boxes,e=[],b=0,c=d.length;c>b;b++)a=d[b],a&&(this.isVisible(a)?this.show(a):e.push(a));return e}.call(this),this.boxes.length||this.config.live)?void 0:this.stop()},e.prototype.offsetTop=function(a){for(var b;void 0===a.offsetTop;)a=a.parentNode;for(b=a.offsetTop;a=a.offsetParent;)b+=a.offsetTop;return b},e.prototype.isVisible=function(a){var b,c,d,e,f;return c=a.getAttribute("data-wow-offset")||this.config.offset,f=window.pageYOffset,e=f+Math.min(this.element.clientHeight,this.util().innerHeight())-c,d=this.offsetTop(a),b=d+a.clientHeight,e>=d&&b>=f},e.prototype.util=function(){return null!=this._util?this._util:this._util=new b},e.prototype.disabled=function(){return!this.config.mobile&&this.util().isMobile(navigator.userAgent)},e}()}).call(this);
/*
 * Foundation Responsive Library
 * http://foundation.zurb.com
 * Copyright 2013, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

/*jslint unparam: true, browser: true, indent: 2 */

// Accommodate running jQuery or Zepto in noConflict() mode by
// using an anonymous function to redefine the $ shorthand name.
// See http://docs.jquery.com/Using_jQuery_with_Other_Libraries
// and http://zeptojs.com/
var libFuncName = null;

if (typeof jQuery === "undefined" &&
    typeof Zepto === "undefined" &&
    typeof $ === "function") {
  libFuncName = $;
} else if (typeof jQuery === "function") {
  libFuncName = jQuery;
} else if (typeof Zepto === "function") {
  libFuncName = Zepto;
} else {
  throw new TypeError();
}

(function ($, window, document, undefined) {
  'use strict';

  /*
    matchMedia() polyfill - Test a CSS media 
    type/query in JS. Authors & copyright (c) 2012: 
    Scott Jehl, Paul Irish, Nicholas Zakas. 
    Dual MIT/BSD license

    https://github.com/paulirish/matchMedia.js
  */

   $('head').append('<meta class="foundation-mq-small">');
   $('head').append('<meta class="foundation-mq-medium">');
   $('head').append('<meta class="foundation-mq-large">');

  window.matchMedia = window.matchMedia || (function( doc, undefined ) {

    "use strict";

    var bool,
        docElem = doc.documentElement,
        refNode = docElem.firstElementChild || docElem.firstChild,
        // fakeBody required for <FF4 when executed in <head>
        fakeBody = doc.createElement( "body" ),
        div = doc.createElement( "div" );

    div.id = "mq-test-1";
    div.style.cssText = "position:absolute;top:-100em";
    fakeBody.style.background = "none";
    fakeBody.appendChild(div);

    return function(q){

      div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

      docElem.insertBefore( fakeBody, refNode );
      bool = div.offsetWidth === 42;
      docElem.removeChild( fakeBody );

      return {
        matches: bool,
        media: q
      };

    };

  }( document ));

  // add dusty browser stuff
  if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisp */) {
      "use strict";
   
      if (this == null) {
        throw new TypeError();
      }

      var t = Object(this),
          len = t.length >>> 0;
      if (typeof fun !== "function") {
          return;
      }

      var res = [],
          thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        if (i in t) {
          var val = t[i]; // in case fun mutates this
          if (fun && fun.call(thisp, val, i, t)) {
            res.push(val);
          }
        }
      }

      return res;
    }
  }

  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== "function") {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }
   
      var aArgs = Array.prototype.slice.call(arguments, 1), 
          fToBind = this, 
          fNOP = function () {},
          fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis
               ? this
               : oThis,
             aArgs.concat(Array.prototype.slice.call(arguments)));
          };
   
      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();
   
      return fBound;
    };
  }

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
      "use strict";
      if (this == null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) { // shortcut for verifying if it's NaN
          n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
          return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    }
  }

  // fake stop() for zepto.
  $.fn.stop = $.fn.stop || function() {
    return this;
  };

  window.Foundation = {
    name : 'Foundation',

    version : '4.3.2',

    cache : {},

    media_queries : {
      small : $('.foundation-mq-small').css('font-family').replace(/\'/g, ''),
      medium : $('.foundation-mq-medium').css('font-family').replace(/\'/g, ''),
      large : $('.foundation-mq-large').css('font-family').replace(/\'/g, '')
    },

    stylesheet : $('<style></style>').appendTo('head')[0].sheet,

    init : function (scope, libraries, method, options, response, /* internal */ nc) {
      var library_arr,
          args = [scope, method, options, response],
          responses = [],
          nc = nc || false;

      // disable library error catching,
      // used for development only
      if (nc) this.nc = nc;

      // check RTL
      this.rtl = /rtl/i.test($('html').attr('dir'));

      // set foundation global scope
      this.scope = scope || this.scope;

      if (libraries && typeof libraries === 'string' && !/reflow/i.test(libraries)) {
        if (/off/i.test(libraries)) return this.off();

        library_arr = libraries.split(' ');

        if (library_arr.length > 0) {
          for (var i = library_arr.length - 1; i >= 0; i--) {
            responses.push(this.init_lib(library_arr[i], args));
          }
        }
      } else {
        if (/reflow/i.test(libraries)) args[1] = 'reflow';

        for (var lib in this.libs) {
          responses.push(this.init_lib(lib, args));
        }
      }

      // if first argument is callback, add to args
      if (typeof libraries === 'function') {
        args.unshift(libraries);
      }

      return this.response_obj(responses, args);
    },

    response_obj : function (response_arr, args) {
      for (var i = 0, len = args.length; i < len; i++) {
        if (typeof args[i] === 'function') {
          return args[i]({
            errors: response_arr.filter(function (s) {
              if (typeof s === 'string') return s;
            })
          });
        }
      }

      return response_arr;
    },

    init_lib : function (lib, args) {
      return this.trap(function () {
        if (this.libs.hasOwnProperty(lib)) {
          this.patch(this.libs[lib]);
          return this.libs[lib].init.apply(this.libs[lib], args);
        } else {
          return function () {};
        }
      }.bind(this), lib);
    },

    trap : function (fun, lib) {
      if (!this.nc) {
        try {
          return fun();
        } catch (e) {
          return this.error({name: lib, message: 'could not be initialized', more: e.name + ' ' + e.message});
        }
      }

      return fun();
    },

    patch : function (lib) {
      this.fix_outer(lib);
      lib.scope = this.scope;
      lib.rtl = this.rtl;
    },

    inherit : function (scope, methods) {
      var methods_arr = methods.split(' ');

      for (var i = methods_arr.length - 1; i >= 0; i--) {
        if (this.lib_methods.hasOwnProperty(methods_arr[i])) {
          this.libs[scope.name][methods_arr[i]] = this.lib_methods[methods_arr[i]];
        }
      }
    },

    random_str : function (length) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

      if (!length) {
        length = Math.floor(Math.random() * chars.length);
      }

      var str = '';
      for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      return str;
    },

    libs : {},

    // methods that can be inherited in libraries
    lib_methods : {
      set_data : function (node, data) {
        // this.name references the name of the library calling this method
        var id = [this.name,+new Date(),Foundation.random_str(5)].join('-');

        Foundation.cache[id] = data;
        node.attr('data-' + this.name + '-id', id);
        return data;
      },

      get_data : function (node) {
        return Foundation.cache[node.attr('data-' + this.name + '-id')];
      },

      remove_data : function (node) {
        if (node) {
          delete Foundation.cache[node.attr('data-' + this.name + '-id')];
          node.attr('data-' + this.name + '-id', '');
        } else {
          $('[data-' + this.name + '-id]').each(function () {
            delete Foundation.cache[$(this).attr('data-' + this.name + '-id')];
            $(this).attr('data-' + this.name + '-id', '');
          });
        }
      },

      throttle : function(fun, delay) {
        var timer = null;
        return function () {
          var context = this, args = arguments;
          clearTimeout(timer);
          timer = setTimeout(function () {
            fun.apply(context, args);
          }, delay);
        };
      },

      // parses data-options attribute on nodes and turns
      // them into an object
      data_options : function (el) {
        var opts = {}, ii, p,
            opts_arr = (el.attr('data-options') || ':').split(';'),
            opts_len = opts_arr.length;

        function isNumber (o) {
          return ! isNaN (o-0) && o !== null && o !== "" && o !== false && o !== true;
        }

        function trim(str) {
          if (typeof str === 'string') return $.trim(str);
          return str;
        }

        // parse options
        for (ii = opts_len - 1; ii >= 0; ii--) {
          p = opts_arr[ii].split(':');

          if (/true/i.test(p[1])) p[1] = true;
          if (/false/i.test(p[1])) p[1] = false;
          if (isNumber(p[1])) p[1] = parseInt(p[1], 10);

          if (p.length === 2 && p[0].length > 0) {
            opts[trim(p[0])] = trim(p[1]);
          }
        }

        return opts;
      },

      delay : function (fun, delay) {
        return setTimeout(fun, delay);
      },

      // animated scrolling
      scrollTo : function (el, to, duration) {
        if (duration < 0) return;
        var difference = to - $(window).scrollTop();
        var perTick = difference / duration * 10;

        this.scrollToTimerCache = setTimeout(function() {
          if (!isNaN(parseInt(perTick, 10))) {
            window.scrollTo(0, $(window).scrollTop() + perTick);
            this.scrollTo(el, to, duration - 10);
          }
        }.bind(this), 10);
      },

      // not supported in core Zepto
      scrollLeft : function (el) {
        if (!el.length) return;
        return ('scrollLeft' in el[0]) ? el[0].scrollLeft : el[0].pageXOffset;
      },

      // test for empty object or array
      empty : function (obj) {
        if (obj.length && obj.length > 0)    return false;
        if (obj.length && obj.length === 0)  return true;

        for (var key in obj) {
          if (hasOwnProperty.call(obj, key))    return false;
        }

        return true;
      },

      addCustomRule : function(rule, media) {
        if(media === undefined) {
          Foundation.stylesheet.insertRule(rule, Foundation.stylesheet.cssRules.length);
        } else {
          var query = Foundation.media_queries[media];
          if(query !== undefined) {
            Foundation.stylesheet.insertRule('@media ' + 
              Foundation.media_queries[media] + '{ ' + rule + ' }');
          }
        }
      }
    },

    fix_outer : function (lib) {
      lib.outerHeight = function (el, bool) {
        if (typeof Zepto === 'function') {
          return el.height();
        }

        if (typeof bool !== 'undefined') {
          return el.outerHeight(bool);
        }

        return el.outerHeight();
      };

      lib.outerWidth = function (el, bool) {
        if (typeof Zepto === 'function') {
          return el.width();
        }

        if (typeof bool !== 'undefined') {
          return el.outerWidth(bool);
        }

        return el.outerWidth();
      };
    },

    error : function (error) {
      return error.name + ' ' + error.message + '; ' + error.more;
    },

    // remove all foundation events.
    off: function () {
      $(this.scope).off('.fndtn');
      $(window).off('.fndtn');
      return true;
    },

    zj : $
  };

  $.fn.foundation = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    return this.each(function () {
      Foundation.init.apply(Foundation, [this].concat(args));
      return this;
    });
  };

}(libFuncName, this, this.document));

/*
    MAIN SCRIPTS - Last updated: 19-11-14
*/
//-----------------------------------------------------------------
// Variables
//-----------------------------------------------------------------

var TOUCH_ENABLED = $(".touch").length;

//-----------------------------------------------------------------
// Document Ready
//-----------------------------------------------------------------

$(document).ready(function() {

    NProgress.start(); // Start preloader bar

    //==================================================
    // Magnific Popup ****
    //
    // Docs:
    // http://dimsemenov.com/plugins/magnific-popup/documentation.html#ajax_type
    //==================================================

    $('.ajax-modal').magnificPopup({
        type: 'ajax',
        showCloseBtn: false,
        callbacks: {
        // wrap the ajax request with a div that we've styled to look good
        parseAjax: function (mfpResponse) {

            var modalTitle = $(mfpResponse.data).filter("[data-header]").attr('data-header');

            // The name of the modal will be taken from attribute 'data-header' - placed on the inner wrapper
            mfpResponse.data = '<div class="mfp-content-header">'+modalTitle+'<button title="Close (Esc)" type="button" class="mfp-close">×</button></div><div class="mfp-content-scroller">' + mfpResponse.data + '</div>';

            }, ajaxContentAdded: function () {
                return this.content;
            }
        },
    });
    //-
});
//-----------------------------------------------------------------
// Window Load
//-----------------------------------------------------------------

$(window).load(function() {
    NProgress.done();
});

//-----------------------------------------------------------------
// Tooltips
//-----------------------------------------------------------------

$(".lv-tooltip").click(function () {
    var $title = $(this).find(".title");
    if (!$title.length) {
        $(".title").remove();
        $(this).append('<span class="title">' + $(this).attr("title") + '</span>');
    } else {
        $title.remove();
    }
});

//-----------------------------------------------------------------
// Simulated Doc Options show on checkbox select
//-----------------------------------------------------------------

$("#tocNodes input[type='checkbox'], #resultsContainerForm input[type='checkbox']").on("click", function() {
    if ($("#tocNodes input:checked").length || $("#resultsContainerForm input:checked").length) {
        $('.lv-doc-options').removeClass('disabled');
    } else {
        $('.lv-doc-options').addClass('disabled');
    }
});

//-----------------------------------------------------------------
// Search Filter (mini-toc)
// http://stackoverflow.com/questions/3442394/jquery-using-text-to-retrieve-only-text-not-nested-in-child-tags
//-----------------------------------------------------------------

// We need to rip out the text and place it inside the next adjacent anchor

$(function() {
    $("#searchsummary #metadocs > ul > li").each(function(){
        var textTitle = $(this).contents().filter(function(){return this.nodeType == 3})[0];
        $('a', $(this)).first().text(textTitle.nodeValue);
        textTitle.nodeValue = '';
    });
});

// Mini toc behavior

$(function() {
    $('#refinesearch .collapsed > .resultMetadocLink, #refinesearch .expanded > .resultMetadocLink').click(function(){
        var $this = $(this);
        // Default 'closed' state
        if ($this.parent().hasClass('collapsed')){

            $this.parent().removeClass('collapsed').addClass('expanded');
            $('ul', $this.parent()).first().show();

        } else if ($this.parent().hasClass('expanded')) {

            $this.parent().removeClass('expanded').addClass('collapsed');
            $('ul', $this.parent()).first().hide();
        }
    });
});

//-----------------------------------------------------------------
// SIDEBAR TABS
//-----------------------------------------------------------------

// Sidebar defaults to the 'is-collapsed' state (class on Master).
// Local storage will remember if user left it open or hasn't touched it.
// In either case, media queries will handle the state naturally, or the sidebar
// will initalize open.

var sidebarStateStorage = localStorage.getItem("sidebarState");
if (sidebarStateStorage == "uncollapsed" || sidebarStateStorage == null) {
    $('.lv-sidebar').removeClass('is-collapsed');
}

//------------ ON CLICK -------------------

$('.lv-sidebar .tabs a').click(function(e){

    var $this = $(this);
    var tabHash = $this.attr('href');
    var sidebar = $this.parent().parent().parent().parent();
    var sidebarCollapsed = sidebar.hasClass('is-collapsed');
    var sidebarUncollapsed = sidebar.hasClass('is-uncollapsed');
    var sizeWhereSidebarIsInFlow = $(window).width() >= 1024;

    e.preventDefault();

    // Strip all tab LIs, apply 'active' to clicked LI
    $('.lv-sidebar .tabs .active').removeClass('active');
    $this.parent().addClass('active');

    // If 'collapse' is clicked (only possible when open)
    if (tabHash == "#collapse") {

        // user has engaged the sidebar. Remember preferences and override media queries
        sidebar.removeClass('is-uncollapsed').addClass('is-collapsed');

        // USER STORAGE - Remember user input
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("sidebarState", "collapsed");
        }

    // Clicking all other tabs - will ** UNCOLLAPSE ** sidebar
    } else {
        // Strip all content sections, apply 'active' to ID that matches tabHash
        $('.tabs-content .active').removeClass('active');
        $(tabHash).addClass('active');

        // 1. Sidebar is collapsed by user engagement directly OR
        // 2. If initalized by medium media query - in which case, there
        // are no explicit collapse/uncollapse classes applied.

        // Uncollapse the sidebar

        if (sidebarCollapsed || (!sidebarCollapsed && !sidebarUncollapsed)) {
            sidebar.removeClass('is-collapsed').addClass('is-uncollapsed');

            // USER STORAGE - Remember user input
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem("sidebarState", "uncollapsed");
            }
        }

        // scroll to top on desktop, sidebar scrolls WITH page on medium-up
        if (sizeWhereSidebarIsInFlow) $.scrollTo(0, 300);
        //$(window).scrollTop(0); // alt method
        //$("html, body").animate({scrollTop: "0"}, 300); // alt method
    }
});

//-----------------------------------------------------------------
// 'context-menu-btn' lives inside the header
//-----------------------------------------------------------------

$('#context-menu-btn').click(function(e){

    var contextMenu = $('.lv-context-menu');
    var contextMenuVisible = contextMenu.is(':visible');
    var contextMenuWidth = contextMenu.width();

    e.preventDefault();

    // Slide the menu offscreen left
    if (contextMenuVisible) {
         contextMenu.transition({
            x: -contextMenuWidth,
            complete: function(){ contextMenu.removeClass('lv-show').css({ x: 0 }).attr('style', '') } });
    } else {
        // Slide onscreen right
        contextMenu.addClass('lv-show');
        contextMenu.css({ x: -contextMenuWidth }).transition({ x: 0 });
    }
});

//-----------------------------------------------------------------
// Kickstart Foundation / Touch Conditionals
//-----------------------------------------------------------------

var touchEvent = TOUCH_ENABLED ? "touchstart" : "click";

//Trigger hamburger by touch on mobile - this eliminates glitch with FastClick.js

$(".lv-hamburger").bind(touchEvent, function(e) {

    $this = $(this);
    //e.preventDefault();

    if ($this.attr('href', '#off-canvas-menu-left')) {
        $("#off-canvas-menu-left").trigger("open.mm");
    }

    if ($this.attr('href', '#off-canvas-menu-right')) {
        $("#off-canvas-menu-right").trigger("open.mm");
    }
});

$(function() {
    $("#off-canvas-menu-left").mmenu({
       "offCanvas": {
          "position": "left"
       }
    });

    $("#off-canvas-menu-right").mmenu({
       "offCanvas": {
          "position": "right"
       }
    });
 });

//-----------------------------------------------------------------
// <= IE8 Caution Message
//-----------------------------------------------------------------

//$('.lv-alert .close-btn').click(function(){$(this).parent().hide();});

//-----------------------------------------------------------------
// +++ HELPERS +++
//-----------------------------------------------------------------
//==================================================
// Developer: COMMAND+S for screen width
//==================================================

$(document).keypress(function(event) {
    if (event.which == 115 && (event.ctrlKey||event.metaKey)|| (event.which == 19)) {
        event.preventDefault();
        alert("(w) "+$(window).width()+" (h) "+$(window).height());

        return false;
    }
    return true;
});

//==================================================
//
//==================================================