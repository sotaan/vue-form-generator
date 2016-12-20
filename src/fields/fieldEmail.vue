<template lang="jade">
	span.input
    input.input__field(type="text", v-model="value", :maxlength="schema.max", :readonly="schema.readonly", :disabled="disabled", :placeholder="schema.placeholder", @focus="toggleHelp", @blur="toggleHelp")
    label.input__label(for='input')
      span.input__label-content {{ schema.label }}
</template>

<script>
	import abstractField from "./abstractField";
	export default {
		mixins: [ abstractField ]
	};
</script>


<style lang="sass" scoped>
	input {
		width: 100%;
	}
</style>
