<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-content">
        <h1>
          Property Agent<br />
          Management<br />
          System
        </h1>
      </div>
    </aside>

    <main class="main-content">
      <AgentForm />
    </main>
  </div>
</template>

<script lang="ts" setup>
  import AgentForm from './components/AgentForm.vue';
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f8f9fa;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  flex: 0 0 350px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.sidebar-content {
  text-align: center;
}

.sidebar h1 {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}
.main-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}


@media (max-width: 992px) {
  .app-layout {
    flex-direction: column;
  }
  .sidebar {
    flex: 0 0 auto;
    min-height: 250px;
  }
  .main-content {
    padding: 1.5rem;
  }
}

@media (max-width: 600px) {
    .app-layout {
        scroll-behavior: auto;
        min-height: 130vh;
    }

    .sidebar {
      min-height: 150px;
    }
    .sidebar h1,
    .main-content .form-title {
      font-size: 1.5rem;
    }

    .main-content {
      padding: 1rem;
      flex: unset;
    }
    .main-content .agent-form-container {
      padding: 1rem;
    }
}
</style>