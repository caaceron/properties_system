<template>
  <div class="agent-form-container">
    <form @submit.prevent="handleSubmit">
      <h2 class="form-title">Create New Agent</h2>

      <div class="form-group">
        <label for="firstName" class="form-label">First Name</label>
        <input id="firstName" v-model="agent.firstName" type="text" class="form-control" placeholder="e.g., Jane" required />
      </div>

      <div class="form-group">
        <label for="lastName" class="form-label">Last Name</label>
        <input id="lastName" v-model="agent.lastName" type="text" class="form-control" placeholder="e.g., Doe" required />
      </div>

      <div class="form-group">
        <label for="email" class="form-label">Email Address</label>
        <input id="email" v-model="agent.email" type="email" class="form-control" placeholder="e.g., jane.doe@example.com" required />
      </div>

      <div class="form-group">
        <label for="mobileNumber" class="form-label">Mobile Number <span class="optional-text">(Optional)</span></label>
        <input id="mobileNumber" v-model="agent.mobileNumber" type="tel" class="form-control" placeholder="e.g., 555-123-4567" />
      </div>

      <div class="d-grid mt-4">
        <button type="submit" class="btn-vue" :disabled="isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{ isLoading ? ' Saving...' : 'Save Agent' }}
        </button>
      </div>
    </form>

    <!-- This message alert will now use our custom styles -->
    <div v-if="message" :class="['alert-vue', messageType === 'success' ? 'alert-vue-success' : 'alert-vue-danger']" role="alert">
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts" setup>
// NO CHANGES NEEDED to your script logic. It is perfect.
import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/agents';
const agent = ref({ id: null, firstName: '', lastName: '', email: '', mobileNumber: '' });
const isLoading = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

const handleSubmit = async () => {
  isLoading.value = true;
  message.value = '';
  try {
    const response = await axios.post(API_URL, agent.value);
    message.value = `Agent "${response.data.firstName} ${response.data.lastName}" created successfully!`;
    messageType.value = 'success';
    agent.value = { id: null, firstName: '', lastName: '', email: '', mobileNumber: '' };
  } catch (error) {
    console.error('Failed to create agent:', error);
    message.value = 'Error: Could not create the agent. Please check the server is running.';
    messageType.value = 'error';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Main form card styling */
.agent-form-container {
  background-color: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
  width: 100%;
  max-width: 450px;
}

.form-title {
  text-align: center;
  margin-bottom: 2.5rem;
  font-weight: 600;
  font-size: 2rem;
  color: #2c3e50; /* Vue Dark Charcoal */
}

/* Form group and label styling */
.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #495057;
}

.optional-text {
  color: #6c757d;
  font-weight: 400;
}

/* Input field styling */
.form-control {
  display: block;
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 8px;
  box-sizing: border-box; /* Important for consistent sizing */
  transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}

/* Enhanced focus state for better UX */
.form-control:focus {
  border-color: #42b983; /* Vue Green */
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(66, 185, 131, 0.2);
}

/* Custom Vue-themed button */
.btn-vue {
  background-color: #42b983; /* Vue Green */
  border: 1px solid #42b983;
  color: white;
  padding: 0.8rem 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s, transform 0.2s;
}

.btn-vue:hover {
  background-color: #38a873; /* Darker Vue Green */
  transform: translateY(-2px);
}

.btn-vue:disabled {
  background-color: #a4d4be;
  border-color: #a4d4be;
  cursor: not-allowed;
  transform: translateY(0);
}

/* Custom Alert Messages */
.alert-vue {
  padding: 1rem;
  margin-top: 1.5rem;
  border: 1px solid transparent;
  border-radius: 8px;
  text-align: center;
}

.alert-vue-success {
  color: #1e6a4b;
  background-color: #e9f7f0;
  border-color: #b3e3cd;
}

.alert-vue-danger {
  color: #842029;
  background-color: #f8d7da;
  border-color: #f5c2c7;
}

.spinner-border-sm {
  width: 1em;
  height: 1em;
  border-width: .2em;
  vertical-align: -0.125em;
  margin-right: 0.5rem;
}

@media (max-width: 600px) {
    .sidebar h1 {
        font-size: 1.5rem;
    }
}
</style>