let TLD

const DOC = document,
	BODY = DOC.body,
	/// document create element
	Tag = DOC.createElement.bind(DOC),
	/// define custom element
	C = (name, opt) => {
		customElements.define("i-" + name, opt)
	},
	/// load style from js
	Style = async (name) => {
		const s = Tag("style")
		s.textContent = (await import("-/css/" + name + ".js")).default
		DOC.head.appendChild(s)
	},
	/// load style from js then create custom element
	S = async (name, opt) => {
		await Style(name)
		C(name, opt)
	},
	/// on event
	On = (elem, dict) => {
		dict = [...Object.entries(dict)]
		let e, func

		for ([e, func] of dict) {
			elem.addEventListener(e, func)
		}

		return () => {
			for ([e, func] of dict) {
				elem.removeEventListener(e, func)
			}
		}
	},
	Div = () => Tag("div"),
	TEXTAREA = Tag("textarea"),
	HtmE = (txt) => {
		TEXTAREA.textContent = txt
		return TEXTAREA.innerHTML
	},
	_cookieSet = (kv, t) => {
		const n = new Date(),
			s = +n
		n.setTime(s + t)
		document.cookie = kv + ";expires=" + n.toUTCString() + ";domain=" + TLD
	},
	Tld = () => {
		let i, k, p, s, v
		if (!TLD) {
			i = 0
			p = document.domain.split(".")
			s = +new Date()
			k = "_" + s
			v = k + "=" + s
			while (i < p.length - 1 && document.cookie.indexOf(v) === -1) {
				TLD = p.slice(-1 - ++i).join(".")
				_cookieSet(v, 1e3)
			}
		}
		return TLD
	},
	cookieSet = (k, v) => _cookieSet(k + "=" + v, 1e11),
	cookieRm = (k) => _cookieSet(k + "=", 0)

export { BODY, C, Div, DOC, HtmE, On, S, Style, Tag, Tld, cookieSet, cookieRm }
