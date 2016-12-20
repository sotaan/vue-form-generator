import {each, isFunction, isString, isArray, isUndefined} from "lodash";

export default {
	props: [
		"model",
		"schema",
		"disabled"
	],

	computed: {
		spanClass () {
			const _class = { invalid: false }
			if (this.schema.errors && this.schema.errors.length) _class.invalid = true
			return _class
		},

		value: {
			cache: false,
			get() {
				let val;
				if (isFunction(this.schema.get))
					val = this.schema.get(this.model);

				else if (this.model && this.schema.model)
					val = this.$get("model." + this.schema.model);

				if (isFunction(this.formatValueToField))
					val = this.formatValueToField(val);

				return val;
			},

			set(newValue) {

				if (isFunction(this.formatValueToModel))
					newValue = this.formatValueToModel(newValue);

				if (isFunction(this.schema.set))
					this.schema.set(this.model, newValue);

				else if (this.schema.model)
					this.$set("model." + this.schema.model, newValue);
			}
		}
	},

	watch: {
		value: function(newVal, oldVal) {
			//console.log("Changed", newVal, oldVal);
			if (isFunction(this.schema.onChanged)) {
				this.schema.onChanged(this.model, newVal, oldVal, this.schema);
			}

			if (this.$parent.options && this.$parent.options.validateAfterChanged === true)
				this.validate();
		}
	},

	methods: {
		validate() {
			this.clearValidationErrors();

			if (this.schema.validator && this.schema.readonly !== true && this.disabled !== true) {

				let validators = [];
				if (!isArray(this.schema.validator)) {
					validators.push(this.schema.validator.bind(this));
				} else {
					each(this.schema.validator, (validator) => {
						validators.push(validator.bind(this));
					});
				}

				each(validators, (validator) => {
					let err = validator(this.value, this.schema, this.model);
					if (err) {
						if (isArray(err))
							Array.prototype.push.apply(this.schema.errors, err);
						else if (isString(err))
							this.schema.errors.push(err);
					}
				});

			}

			if (isFunction(this.schema.onValidated)) {
				this.schema.onValidated(this.model, this.schema.errors, this.schema);
			}

			return this.schema.errors;
		},

		clearValidationErrors() {
			if (isUndefined(this.schema.errors))
				this.$set("schema.errors", []); // Be reactive
			else
				this.schema.errors.splice(0); // Clear
		},

		toggleHelp (event) {
			this.schema.showHelp = !this.schema.showHelp
		}
	},

	created () {
		this.$set("schema.showHelp", false)
	}
};
