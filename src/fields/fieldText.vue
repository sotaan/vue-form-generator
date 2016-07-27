<template lang="jade">
.material-textfield.grey
  input(type="text", v-model="value", :maxlength="schema.max", :readonly="schema.readonly", :disabled="disabled", :placeholder="schema.placeholder")
  label(data-content="{{field.label}}") {{ field.label }}
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
