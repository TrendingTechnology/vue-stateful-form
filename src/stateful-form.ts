import Vue from 'vue';
import { get, set, merge } from 'lodash-es';

const types = {
  button: {
    tag: 'button',
    setter: 'button',
    data: {
      attr: {
        type: 'button',
      },
    },
  },
  checkbox: {
    tag: 'input',
    setter: 'checked',
    data: {},
  },
  radio: {
    tag: 'input',
    setter: 'checked',
    data: {},
  },
  color: {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  date: {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  'datetime-local': {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  email: {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  file: {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  hidden: {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  image: {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  month: {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  number: {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  password: {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  range: {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  reset: {
    tag: 'input',
    setter: 'button',
    data: {},
  },
  search: {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  submit: {
    tag: 'input',
    setter: 'button',
    data: {},
  },
  tel: {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  text: {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  time: {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  url: {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  week: {
    tag: 'input',
    setter: 'value',
    data: {},
  },
  textarea: {
    tag: 'textarea',
    setter: 'innerHTML',
    data: {},
  },
  select: {
    tag: 'select',
    setter: 'selected',
    data: {},
  },
  selectMultiple: {
    tag: 'select',
    setter: 'selected',
    data: {
      domProps: {
        multiple: true,
      },
    },
  },
};

interface Methods {
  getFormData(): Record<string, any>
  inputHandler(event?: InputEvent): void
}

export interface StatefulFormDetails {
  id?: string
  name: string
  label?: string | null
  type: string
  required?: boolean
  class?: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
  maxlength?: number
  rows?: number
  cols?: number
  pattern?: string
  data?: Vue.VNodeData
  options?: Array<{
    label: string
    value: any
  }>
}

interface Data {
  $attrs: {
    value: Record<string, any>
  }
}

interface Props {
  schema: Array<StatefulFormDetails>
  debounce: number
}

const makeOptions = function(this: Data, createElement: Vue.CreateElement, details: StatefulFormDetails, element: any) {
  const options: Array<Vue.VNode> = [];

  if (!details.options) {
    return options;
  }

  if (element.setter === 'selected') {
    const newOptions = details.options.map(({ label, value }) => {
      const attrVal = get(this.$attrs, `value[${details.name}]`);
      const selected = this.$attrs.value && Array.isArray(attrVal) ? attrVal.includes(value) : attrVal === value;

      return createElement(
        'option',
        {
          attrs: {
            value,
            selected,
          },
          domProps: {
            innerText: label,
          },
        }
      );
    });

    options.push(...newOptions);
  }

  if (element.setter === 'checked') {
    const newOptions = details.options.map(({ label, value }, index: number) => {
      const checked = this.$attrs.value && Array.isArray(this.$attrs.value[details.name] || []) ? (this.$attrs.value[details.name] || []).includes(value) : this.$attrs.value[details.name] === value;

      return createElement(
        'div',
        {
          class: 'form-group-label',
        },
        [
          createElement(
            'label',
            {
              class: `form-label form-label-${element.tag} form-label-${details.type}`,
              attrs: {
                for: `${details.name}-${index}`,
              },
            },
            [
              createElement(
                'span', // using span for inline labels
                {
                  class: 'form-label-text',
                  domProps: {
                    innerText: label,
                  },
                }
              ),
              createElement(
                'input',
                {
                  attrs: {
                    value,
                    checked,
                    id: `${details.name}-${index}`,
                    name: details.name,
                    type: details.type,
                  },
                  domProps: {
                    innerText: label,
                  },
                  ref: `${details.name}-${index}`,
                }
              )
            ]
          ),
        ]
      );
    });

    options.push(...newOptions);
  }

  return options;
};

const makeElement = function(this: Data, details: StatefulFormDetails) {
  // either handle native types or support a custom type
  const element = types[details.type as keyof typeof types] || {
    tag: details.type,
    setter: 'custom',
    data: {},
  };

  element.data = merge(element.data, details.data, {
    domProps: {},
    class: `form-input form-input-${element.tag} form-input-${details.type}`,
    attrs: {
      id: details.id || details.name,
      ...details,
    },
    ref: details.name,
  });

  if (['value', 'checked'].includes(element.setter)) {
    set(element, 'data.attrs.value', this.$attrs.value ? this.$attrs.value[details.name] : '');
  }

  if (['textarea'].includes(element.tag)) {
    set(element, 'data.domProps.innerHTML', this.$attrs.value ? this.$attrs.value[details.name] : '');
  }

  if (element.setter === 'button') {
    set(element, 'data.attrs.value', details.name);
  }

  if (element.setter === 'custom') {
    set(element, 'data.props.value', this.$attrs.value ? this.$attrs.value[details.name] : '');
  }

  if (['button'].includes(element.tag)) {
    set(element, 'data.domProps.innerHTML', details.label || details.name);
  }

  return element;
};

const makeInput = function(this: Data, createElement: Vue.CreateElement, details: StatefulFormDetails) {
  const element = makeElement.call(this, details);

  const options = makeOptions.call(this, createElement, details, element);

  if (element.setter === 'checked') {
    element.tag = 'div';
    // @ts-ignore
    element.data.ref = null;
  }

  return createElement(
    'div',
    {
      class: `form-input-wrapper form-input-${element.tag} form-input-${details.type} ${String(details.class)}`,
    },
    [
      createElement(
        element.setter === 'checked' ? 'div' : 'label',
        {
          class: element.setter === 'checked' ? 'form-label-wrapper' : `form-label form-label-${element.tag} form-label-${details.type}`,
          attrs: {
            for: details.name,
          },
        },
        [
          ['checked', 'button'].includes(element.setter) === false && details.label !== null ? createElement(
            'div',
            {
              class: 'form-label-text',
              domProps: {
                innerText: details.label || details.name,
              },
            },
          ) : null,
          createElement(
            element.tag,
            // @ts-ignore
            element.data,
            options
          ),
        ],
      ),
    ],
  );
};

export default Vue.extend<Data, Methods, {}, Props>({
  name: 'StatefulForm',
  props: {
    schema: {
      type: Array,
      required: true,
    },
    debounce: {
      type: Number,
      required: false,
      default: 10,
      // make sure the debounce isnt below 0
      validator(value: number) {
        return value >= 0;
      }
    },
  },
  // updated() {
  //   console.log(JSON.stringify(this.$attrs.value, null, 2));
  // },
  methods: {
    getFormData() {
      const formData = new FormData(this.$el as HTMLFormElement);

      // @ts-ignore
      const results = Array.from(formData)
        // @ts-ignore
        .reduce((result: Record<string, any>, [key]: [string, any]) => {
          // handle fields that use multiple values
          // @ts-ignore
          const scheme = this.schema.find(detail => detail.name === key) || this.schema[0];
          const val = (scheme.options || []).length > 1 && ['radio', 'select'].includes(scheme.type) === false ? formData.getAll(key) : formData.get(key);
          result[key] = val;

          return result;
        }, {});

      // fill in missing values that weren't included
      Object.entries(this.schema)
        // @ts-ignore
        .forEach((detail) => {
          const { name, type, options = [] } = detail[1];
          // don’t include these results in the output since they are buttons
          if (['reset', 'submit', 'button'].includes(type)) {
            return;
          }

          // @ts-ignore
          if (!results[name]) {
            // set the default value for "none"
            // @ts-ignore
            results[name] = options.length > 1 && ['radio', 'select'].includes(type) === false ? [] : null;
          }
        });

      return results as Record<string, any>;
    },
    inputHandler() {
      // clear the timeout so we dont fire in succession
      // @ts-ignore
      clearTimeout(this.delayer);
      // waits 200 milliseconds before triggering
      // @ts-ignore
      this.delayer = setTimeout(() => {
        const data = this.getFormData();

        this.$emit('input', data);
      }, this.debounce);
    },
  },
  render(createElement) {
    return createElement(
      'form',
      {
        class: 'stateful-form',
        on: {
          ...this.$listeners,
          input: this.inputHandler
        },
      },
      this.schema.map((detail) => makeInput.call(this, createElement, detail)),
    );
  },
});
