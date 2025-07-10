<template>
  <div class="agent-form-container">
    <div v-if="showEditLoader" class="edit-loader-section">
      <div class="form-group">
        <label for="agentId" class="form-label">Edit Existing Agent</label>
        <div class="input-group">
          <input id="agentId" v-model="agentIdToLoad" type="text" class="form-control" placeholder="Enter Agent ID" />
          <button @click="loadAgentForEdit" class="btn-load" type="button">Load</button>
        </div>
      </div>
      <hr class="form-divider" />
    </div>

    <div v-if="!isEditMode" class="edit-toggle-section">
      <button @click="toggleEditLoader" class="btn-link">
        {{ showEditLoader ? 'Hide Edit Section' : 'Want to edit an existing agent?' }}
      </button>
    </div>

    <fieldset :disabled="isLoading" class="form-fieldset">
      <form @submit.prevent="handleSubmit">
        <h2 class="form-title">{{ isEditMode ? 'Update Agent' : 'Create New Agent' }}</h2>
        
        <div class="form-group">
          <label for="firstName" class="form-label">First Name</label>
          <input id="firstName" v-model="agent.firstName" type="text" class="form-control" :class="{ 'is-invalid': errors.firstName }" :aria-invalid="!!errors.firstName" @input="clearError('firstName')"/>
        
          <div v-if="errors.firstName" class="error-text">{{ errors.firstName }}</div>
        </div>

        <div class="form-group">
          <label for="lastName" class="form-label">Last Name</label>
          <input id="lastName" v-model="agent.lastName" type="text" class="form-control" :class="{ 'is-invalid': errors.lastName }" :aria-invalid="!!errors.lastName" @input="clearError('lastName')"/>
        
          <div v-if="errors.lastName" class="error-text">{{ errors.lastName }}</div>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input id="email" v-model="agent.email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" :aria-invalid="!!errors.email" @input="clearError('email')"/>
        
          <div v-if="errors.email" class="error-text">{{ errors.email }}</div>
        </div>

        <div class="form-group">
          <label for="mobileNumber" class="form-label">Mobile Number <span class="optional-text">(Optional)</span></label>
          <vue-tel-input
            id="mobileNumber"
            ref="phoneInput"
            v-model="agent.mobileNumber"
            :inputOptions="{ placeholder: 'Enter phone number' }"
            mode="international"
            :class="{ 'is-invalid': phoneError }"
            @input="phoneError = ''"
          ></vue-tel-input>

          <div v-if="phoneError" class="error-text">{{ phoneError }}</div>
        </div>

        <div class="d-grid mt-4">
          <button type="submit" class="btn-vue" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Agent' : 'Save Agent') }}
          </button>
          
          <button v-if="isEditMode" @click="resetForm" class="btn-secondary btn-vue mt-2" type="button">
            Cancel Edit (Create New)
          </button>
        </div>
      </form>
    </fieldset>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:3000/agents';
const agent = ref({ id: null, firstName: '', lastName: '', email: '', mobileNumber: '' });
const isLoading = ref(false);
const errors = ref<{ [key: string]: string }>({});

const phoneError = ref('');
const isPhoneCurrentlyValid = ref(true);

const agentIdToLoad = ref('');
const isEditMode = computed(() => !!agent.value.id);
const showEditLoader = ref(false);
const toggleEditLoader = () => {
  showEditLoader.value = !showEditLoader.value;
  if (!showEditLoader.value) {
    agentIdToLoad.value = '';
  }
};
const loadAgentForEdit = async () => {
  if (!agentIdToLoad.value.trim()) {
    Swal.fire('No ID', 'Please enter an Agent ID to load.', 'info');
    return;
  }
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_URL}/${agentIdToLoad.value}`);
    agent.value = response.data;
    phoneError.value = '';
    errors.value = {};
  } catch (error) {
    Swal.fire('Error', 'Could not find an agent with that ID.', 'error');
  } finally {
    isLoading.value = false;
  }
};
const resetForm = () => {
  agent.value = { id: null, firstName: '', lastName: '', email: '', mobileNumber: '' };
  agentIdToLoad.value = '';
  errors.value = {};
  phoneError.value = '';
  showEditLoader.value = false; 
};

const clearError = (fieldName: keyof typeof errors.value) => {
  if (errors.value[fieldName]) {
    delete errors.value[fieldName];
  }
};

const handleSubmit = async () => {
  phoneError.value = '';
  const phone = agent.value.mobileNumber;
  const isPhonePopulated = phone && phone.trim() !== '';

  if (isPhonePopulated) {
    if (!phone.startsWith('+')) {
      phoneError.value = 'Please use valid format (e.g., +63...).';
      return;
    }
    
    if (!isPhoneCurrentlyValid.value) {
      phoneError.value = 'The phone number is invalid.';
      return;
    }
  }

  isLoading.value = true;
  errors.value = {};

  try {
    let response;

    if (isEditMode.value) {
      response = await axios.put(`${API_URL}/${agent.value.id}`, agent.value);
      Swal.fire({
        icon: 'success',
        title: 'Agent Updated!',
        text: response.data.message,
        timer: 2500,
        showConfirmButton: false,
      });
    } else {
      response = await axios.post(API_URL, agent.value);
      Swal.fire({
        icon: 'success',
        title: 'Agent Created!',
        text: `Agent "${response.data.firstName} ${response.data.lastName}" was added successfully.`,
        timer: 2500,
        showConfirmButton: false,
      });
    }
    resetForm();
  } catch (error) {

    if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
      const backendErrors = error.response.data.errors;
      if (backendErrors && Array.isArray(backendErrors)) {
        const newErrors: { [key: string]: string } = {};

        for (const err of backendErrors) {
          const fieldName = err.path.split('.')[1];
          if (fieldName) {
            newErrors[fieldName] = err.message;
          }
        }
        errors.value = newErrors;
      } else {
        console.error('Failed to create agent:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops... Something went wrong!',
          text: 'Could not connect to the server. Please try again later.',
        });
      }
    } else {
      console.error('Failed to create agent:', error);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
  .form-fieldset:disabled {
    opacity: 0.6;
    pointer-events: none;
  }
  .error-text {
    color: #d32f2f;
    font-size: 0.875rem;
    display: block;
    margin-top: 0.25rem;
  }
  .edit-toggle-section {
    text-align: center;
    margin-top: 1.5rem;
  }
  .btn-link {
    background: none;
    border: none;
    color: #6c757d;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
  }
  .btn-link:hover {
    color: #2c3e50;
  }
  .input-group {
    display: flex;
  }
  .input-group .form-control {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .btn-load {
    border: 1px solid #ced4da;
    border-left: none;
    background-color: #f8f9fa;
    padding: 0.8rem 1rem;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    cursor: pointer;
  }
  .btn-load:hover {
    background-color: #e2e6ea;
  }
  .form-divider {
    border: none;
    border-top: 2px solid #000;
    margin-bottom: 2rem;
  }
  .btn-secondary {
    background-color: #6c757d !important;
    border-color: #6c757d !important;
    color: white;
  }
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
    color: #2c3e50;
  }
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

  :deep(.vue-tel-input) {
    border: 1px solid #ced4da;
    border-radius: 8px;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
  }
  :deep(.vue-tel-input:focus-within) {
    border-color: #42b983;
    box-shadow: 0 0 0 0.25rem rgba(66, 185, 131, 0.2);
  }
  :deep(.vti__input) {
    border: none;
    border-radius: 0 8px 8px 0;
    padding: 0.8rem 1rem;
  }
  :deep(.vti__dropdown) {
    border-radius: 8px 0 0 8px;
  }
  :deep(.vti__dropdown:hover) {
    background-color: #f1f1f1;
  }
  :deep(.vue-tel-input.is-invalid) {
    border-color: #d32f2f;
  }
  :deep(.vue-tel-input.is-invalid:focus-within) {
    border-color: #d32f2f;
    box-shadow: 0 0 0 0.25rem rgba(211, 47, 47, 0.25);
  }

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
    box-sizing: border-box;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
  }
  .form-control.is-invalid {
    border-color: #d32f2f;
  }
  .form-control.is-invalid:focus {
    border-color: #d32f2f;
    box-shadow: 0 0 0 0.25rem rgba(211, 47, 47, 0.25);
  }
  .form-control:focus { 
    border-color: #42b983; 
    outline: 0; 
    box-shadow: 0 0 0 0.25rem rgba(66, 185, 131, 0.2); 
  }


  .btn-vue {
    background-color: #42b983;
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
    background-color: #38a873;
    transform: translateY(-2px);
  }
  .btn-vue:disabled {
    background-color: #a4d4be;
    border-color: #a4d4be;
    cursor: not-allowed;
    transform: translateY(0);
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