document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');

  const formAction = document.getElementById('formAction');
  const methodSelect = document.getElementById('method');
  const formFields = document.getElementById('formFields');
  const addFieldBtn = document.getElementById('addField');
  const clearFieldsBtn = document.getElementById('clearFields');
  const submitFormBtn = document.getElementById('submitForm');
  const responseContainer = document.getElementById('response');
  const responseContent = document.getElementById('responseContent');

  // Check if all elements were found
  console.log('Elements found:', {
    formAction: !!formAction,
    methodSelect: !!methodSelect,
    formFields: !!formFields,
    addFieldBtn: !!addFieldBtn,
    clearFieldsBtn: !!clearFieldsBtn,
    submitFormBtn: !!submitFormBtn,
    responseContainer: !!responseContainer,
    responseContent: !!responseContent,
  });

  if (!addFieldBtn) {
    console.error('Add Field button not found!');
    return;
  }

  // Field type options
  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'password', label: 'Password' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select' },
    { value: 'hidden', label: 'Hidden' },
    { value: 'file', label: 'File' },
    { value: 'date', label: 'Date' },
  ];

  // Counter for field IDs
  let fieldCounter = 0;

  // Add a new field
  function addField() {
    const fieldId = `field_${fieldCounter++}`;
    const fieldRow = document.createElement('div');
    fieldRow.classList.add('field-row', 'fade-in');
    fieldRow.dataset.id = fieldId;

    const fieldTypeOptions = fieldTypes.map((type) => `<option value="${type.value}">${type.label}</option>`).join('');

    fieldRow.innerHTML = `
            <div class="delete-field" title="Remove field">×</div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label for="${fieldId}_name" class="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
                    <input type="text" id="${fieldId}_name" placeholder="name" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                
                <div>
                    <label for="${fieldId}_type" class="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
                    <select id="${fieldId}_type" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        ${fieldTypeOptions}
                    </select>
                </div>
                
                <div>
                    <label for="${fieldId}_value" class="block text-sm font-medium text-gray-700 mb-1">Value</label>
                    <input type="text" id="${fieldId}_value" placeholder="value" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                </div>
            </div>
            
            <div class="mt-3">
                <label class="flex items-center">
                    <input type="checkbox" id="${fieldId}_required" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                    <span class="ml-2 text-sm text-gray-700">Required field</span>
                </label>
            </div>
            
            <div id="${fieldId}_options_container" class="mt-3 hidden">
                <label for="${fieldId}_options" class="block text-sm font-medium text-gray-700 mb-1">Options (comma separated)</label>
                <input type="text" id="${fieldId}_options" placeholder="option1, option2, option3" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            
            <div class="field-preview mt-3"></div>
        `;

    formFields.appendChild(fieldRow);

    // Add event listeners for this field
    const typeSelect = document.getElementById(`${fieldId}_type`);
    const optionsContainer = document.getElementById(`${fieldId}_options_container`);
    const nameInput = document.getElementById(`${fieldId}_name`);
    const valueInput = document.getElementById(`${fieldId}_value`);
    const requiredCheckbox = document.getElementById(`${fieldId}_required`);
    const optionsInput = document.getElementById(`${fieldId}_options`);
    const previewDiv = fieldRow.querySelector('.field-preview');

    // Show options input for select/radio fields
    typeSelect.addEventListener('change', () => {
      if (typeSelect.value === 'select' || typeSelect.value === 'radio') {
        optionsContainer.classList.remove('hidden');
      } else {
        optionsContainer.classList.add('hidden');
      }
      updatePreview();
    });

    // Event listeners for preview updates
    nameInput.addEventListener('input', updatePreview);
    valueInput.addEventListener('input', updatePreview);
    requiredCheckbox.addEventListener('change', updatePreview);
    optionsInput.addEventListener('input', updatePreview);

    // Delete button
    const deleteBtn = fieldRow.querySelector('.delete-field');
    deleteBtn.addEventListener('click', () => {
      fieldRow.remove();
    });

    // Update preview immediately
    updatePreview();

    function updatePreview() {
      const name = nameInput.value || 'name';
      const value = valueInput.value || '';
      const type = typeSelect.value;
      const required = requiredCheckbox.checked;
      const options = optionsInput.value
        .split(',')
        .map((o) => o.trim())
        .filter((o) => o);

      let previewHTML = '';

      if (type === 'select') {
        previewHTML = `<select name="${name}" ${required ? 'required' : ''}>`;
        if (options.length) {
          options.forEach((option) => {
            previewHTML += `<option value="${option}" ${value === option ? 'selected' : ''}>${option}</option>`;
          });
        } else {
          previewHTML += `<option value="${value}">${value || 'Option'}</option>`;
        }
        previewHTML += '</select>';
      } else if (type === 'textarea') {
        previewHTML = `<textarea name="${name}" ${required ? 'required' : ''}>${value}</textarea>`;
      } else if (type === 'checkbox') {
        previewHTML = `<input type="checkbox" name="${name}" ${value ? 'checked' : ''} ${required ? 'required' : ''}>`;
      } else if (type === 'radio') {
        if (options.length) {
          options.forEach((option) => {
            previewHTML += `<input type="radio" name="${name}" value="${option}" ${value === option ? 'checked' : ''} ${
              required ? 'required' : ''
            }> ${option}<br>`;
          });
        } else {
          previewHTML = `<input type="radio" name="${name}" value="${value}" ${required ? 'required' : ''}> ${
            value || 'Option'
          }`;
        }
      } else {
        previewHTML = `<input type="${type}" name="${name}" value="${value}" ${required ? 'required' : ''}>`;
      }

      previewDiv.innerHTML = `
                <div class="text-xs text-gray-500 mb-1">Preview:</div>
                <div class="text-sm">${previewHTML}</div>
            `;
    }
  }

  // Add initial field
  addField();

  // Fix: Make sure event listeners are properly defined
  console.log('Setting up Add Field button click listener');
  addFieldBtn.addEventListener('click', function () {
    console.log('Add Field button clicked');
    addField();
  });

  clearFieldsBtn.addEventListener('click', () => {
    formFields.innerHTML = '';
    addField(); // Add one empty field
  });

  submitFormBtn.addEventListener('click', async () => {
    const url = formAction.value.trim();
    if (!url) {
      alert('Please enter a form action URL');
      formAction.focus();
      return;
    }

    // Collect form data
    const formData = new FormData();
    const fieldRows = formFields.querySelectorAll('.field-row');

    fieldRows.forEach((row) => {
      const fieldId = row.dataset.id;
      const name = document.getElementById(`${fieldId}_name`).value.trim();
      const value = document.getElementById(`${fieldId}_value`).value;
      const type = document.getElementById(`${fieldId}_type`).value;

      if (name) {
        if (type === 'file') {
          // File inputs require actual File objects, which we can't simulate easily
          // This is just a placeholder for demonstration
          formData.append(name, new Blob(['Simulated file content']), 'simulated_file.txt');
        } else {
          formData.append(name, value);
        }
      }
    });

    // Show loading state
    submitFormBtn.disabled = true;
    submitFormBtn.innerHTML = '<span class="loading mr-2"></span> Submitting...';

    try {
      // Method from the select
      const method = methodSelect.value;

      let response;
      let responseObj = {};

      if (method === 'GET') {
        // For GET requests, convert FormData to URL parameters
        const params = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
          params.append(key, value);
        }
        response = await fetch(`${url}?${params.toString()}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });
      } else {
        // For POST requests
        response = await fetch(url, {
          method: 'POST',
          body: formData,
        });
      }

      // Try to parse as JSON, fall back to text
      try {
        responseObj = await response.json();
      } catch (e) {
        responseObj = {
          status: response.status,
          statusText: response.statusText,
          text: await response.text(),
        };
      }

      // Display response
      responseContainer.classList.remove('hidden');
      responseContent.textContent = JSON.stringify(responseObj, null, 2);
    } catch (error) {
      responseContainer.classList.remove('hidden');
      responseContent.textContent = `Error: ${error.message}`;
    } finally {
      // Reset button state
      submitFormBtn.disabled = false;
      submitFormBtn.innerHTML = 'Submit Form';
    }
  });
});
