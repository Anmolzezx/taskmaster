package com.taskmaster.app.ui.task

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.taskmaster.core.network.model.TaskDto

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditTaskScreen(
    task: TaskDto,
    onBackClick: () -> Unit,
    onSaveClick: (String, String?, String, String) -> Unit,
    isSaving: Boolean,
    modifier: Modifier = Modifier
) {
    var title by remember { mutableStateOf(task.title) }
    var description by remember { mutableStateOf(task.description ?: "") }
    var selectedStatus by remember { 
        mutableStateOf(TaskStatus.values().find { it.value == task.status } ?: TaskStatus.TODO) 
    }
    var selectedPriority by remember { 
        mutableStateOf(TaskPriority.values().find { it.value == task.priority } ?: TaskPriority.MEDIUM) 
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Edit Task") },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, "Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Title Field
            OutlinedTextField(
                value = title,
                onValueChange = { title = it },
                label = { Text("Task Title") },
                singleLine = true,
                enabled = !isSaving,
                modifier = Modifier.fillMaxWidth(),
                isError = title.isBlank()
            )

            // Description Field
            OutlinedTextField(
                value = description,
                onValueChange = { description = it },
                label = { Text("Description (Optional)") },
                minLines = 3,
                maxLines = 5,
                enabled = !isSaving,
                modifier = Modifier.fillMaxWidth()
            )

            // Status Selection
            Text(
                text = "Status",
                style = MaterialTheme.typography.labelLarge
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                TaskStatus.values().forEach { status ->
                    FilterChip(
                        selected = selectedStatus == status,
                        onClick = { selectedStatus = status },
                        label = { Text(status.displayName) },
                        enabled = !isSaving
                    )
                }
            }

            // Priority Selection
            Text(
                text = "Priority",
                style = MaterialTheme.typography.labelLarge
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                TaskPriority.values().forEach { priority ->
                    FilterChip(
                        selected = selectedPriority == priority,
                        onClick = { selectedPriority = priority },
                        label = { Text(priority.displayName) },
                        enabled = !isSaving
                    )
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Save Button
            Button(
                onClick = {
                    onSaveClick(
                        title,
                        description.ifBlank { null },
                        selectedStatus.value,
                        selectedPriority.value
                    )
                },
                enabled = !isSaving && title.isNotBlank(),
                modifier = Modifier.fillMaxWidth()
            ) {
                if (isSaving) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(20.dp),
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                }
                Text(if (isSaving) "Saving..." else "Save Changes")
            }
        }
    }
}
