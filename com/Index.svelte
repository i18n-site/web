<template lang="pug">
p
  button(@click=captcha) box captcha
  button(@click=msg) toast error msg
  button(@click=auth) auth

i-auth
//-
  i-state(_="//api.u-01.eu.org")
</template>

<style lang="stylus">
:global(_)
	height 100vh
	display flex
	flex-direction column

p>button
	margin 1rem

i-auth
	margin auto
</style>

<script lang="coffee">
> -/dom/Toast.js > Warn
  -/dom/Auth.js > signin
  -/srv.js > demoCaptcha userName
  svelte > onMount
  -/com/state.js

onMount =>
  console.log '>', await userName()
  return

auth = =>
  signin()
  return

msg = =>
  Warn 'error msg example'
  return

captcha = =>
  await demoCaptcha()
  return
</script>
