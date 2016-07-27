<template lang="jade">
.material-textfield.grey
	input(type="email", v-model="value", :readonly="schema.readonly", :disabled="disabled", :placeholder="schema.placeholder")
	label(data-content="{{schema.label}}") {{ schema.label }}
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
