<template lang="jade">
//.material-textfield.grey
//  input(type="text", v-model="value", :maxlength="schema.max", :readonly="schema.readonly", :disabled="disabled", :placeholder="schema.placeholder")
//  label(data-content="{{schema.label}}") {{ schema.label }}*/
  span.input
    input.input__field(type='text')
    label.input__label(for='input')
      span.input__label-content {{ schema.label }}
</template>

<script>
	import abstractField from "./abstractField";

	export default {
		mixins: [ abstractField ]
	};

</script>
