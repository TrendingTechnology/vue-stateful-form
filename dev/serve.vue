<template>
  <div id="app">
    <button type="button" @click.prevent="changeData">Change Data</button>
    <div class="flex flex-row mx-auto my-4 justify-center">
      <StatefulForm class="flex flex-col" v-model="data" :schema="schema" method="GET" enctype="multipart/form-data" @submit="handleSubmit" />
      <pre v-html="JSON.stringify(data, null, 2)"></pre>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import StatefulForm, { StatefulFormDetails } from '@/stateful-form.ts';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    StatefulForm,
  },
  data() {
    return {
      data: {
        'my-text': 'This is my text field',
        'my-email': 'james2doyle@gmail.com',
        // 'my-file': 'james2doyle@gmail.com',
        'my-tel': '12345678900',
        'my-url': 'https://ohdoylerules.com',
        'my-textarea': 'This is my textarea',
        'my-select': '2',
        'my-multi-select': ['3'],
        'my-range': '25',
        'my-checkbox': '1',
        'my-multi-checkbox': ['2'],
        'my-radio': '1',
      },
      schema: [
        {
          name: 'my-text',
          label: 'My Text Field',
          placeholder: 'Enter in your text',
          type: 'text',
          required: true,
        },
        {
          name: 'my-email',
          // label: null,
          type: 'email',
          required: true,
        },
        {
          name: 'my-file',
          type: 'file',
        },
        {
          name: 'my-tel',
          type: 'tel',
        },
        {
          name: 'my-url',
          type: 'url',
        },
        {
          name: 'my-password',
          type: 'password',
        },
        {
          name: 'my-textarea',
          type: 'textarea',
        },
        {
          name: 'my-checkbox',
          type: 'checkbox',
          options: [
            { value: '1', label: 'Enabled?' },
          ],
        },
        {
          name: 'my-multi-checkbox',
          type: 'checkbox',
          options: [
            { value: '1', label: 'Checkbox One' },
            { value: '2', label: 'Checkbox Two' },
            { value: '3', label: 'Checkbox Three' },
          ],
        },
        {
          name: 'my-radio',
          type: 'radio',
          options: [
            { value: '1', label: 'Radio One' },
            { value: '2', label: 'Radio Two' },
            { value: '3', label: 'Radio Three' },
          ],
        },
        {
          name: 'my-range',
          type: 'range',
          min: '1',
          max: '100',
        },
        {
          name: 'my-select',
          type: 'select',
          options: [
            { value: '1', label: 'One' },
            { value: '2', label: 'Two' },
            { value: '3', label: 'Three' },
          ],
        },
        {
          name: 'my-multi-select',
          type: 'selectMultiple',
          options: [
            { value: '1', label: 'One' },
            { value: '2', label: 'Two' },
            { value: '3', label: 'Three' },
          ],
        },
        {
          name: 'my-button',
          type: 'button',
        },
        {
          name: 'my-reset',
          type: 'reset',
        },
        {
          name: 'my-submit',
          type: 'submit',
        },
      ] as Array<StatefulFormDetails>,
    }
  },
  methods: {
    changeData() {
      this.data['my-text'] = 'Updated to: ' + Date.now().toString().slice(-4);
    },
    handleSubmit(event: InputEvent) {
      event.preventDefault();

      console.log('submission captured and stopped');
      console.log('data', this.data);

      return false;
    },
  },
});
</script>

<style>
form {
  width: 100%;
  max-width: 255px;
}

.my-4 {
  margin-top: 4rem;
  margin-bottom: 4rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.justify-center {
  justify-content: center;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.flex-row {
  flex-direction: row;
}
</style>
