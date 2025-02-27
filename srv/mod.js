export * from "srv/api.js"
import { T1Decode as CaptchaD } from "srv/_.pb.js"
import utf8d from "-/lib/utf8d.js"
import { Tag, body, HtmE } from "-/dom/_.js"
import { set } from "srv/api.js"
import { Warn } from "-/dom/Toast.js"
import Captcha from "-/dom/Captcha.js"

export { CaptchaD }

const HEADERS = {},
	ACCEPT_LANGUAGE = "accept-language"

// TODO : navigator.language
HEADERS[ACCEPT_LANGUAGE] = "en"

let CAPTCHA_PENDING = []

const captchaPendingReset = () => {
	CAPTCHA_PENDING = []
}

export default (url) =>
	set(
		url,
		Warn,
		(headers) => {
			Object.assign(headers, HEADERS)
		},
		(
			// hpc/rust/icall/proto/_.proto
			code,
			msg,
			// [decode, resolve, reject, func_id, args_bin]
			req,
			batchCall,
		) => {
			/*
OK = 0;

JSON = 1;
CODE = 2;
BIN = 3;

CAPTCHA = 10;
NEED_SIGNIN = 11;
NO_PERMISSION = 12;

MISS_FUNC = 100;
ARGS_INVALID = 101;
BATCH_LIMIT = 102;
CALL_ERROR = 103;
MIDDLEWARE_ERROR = 104;
    */
			if (
				code == 10 // CAPTCHA
			) {
				CAPTCHA_PENDING.push(req)
				if (msg.length) {
					Captcha(
						(id) => {
							HEADERS.c = id
							const promise = batchCall(CAPTCHA_PENDING)
							delete HEADERS.c
							captchaPendingReset()
							return promise
						},
						() => {
							CAPTCHA_PENDING.forEach((t) => {
								// reject
								t[2]()
							})
							captchaPendingReset()
						},
					).I = CaptchaD(msg)
				}
				return
			}
			if (code > 99) {
				msg = utf8d(msg)
				Warn(code + " " + HtmE(msg))
			}
			if (code == 1) {
				// JSON
				msg = JSON.parse(utf8d(msg))
			}
			return [code, msg]
		},
	)
