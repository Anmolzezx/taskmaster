package com.taskmaster.app.ui.common

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer

/**
 * Animated visibility for list items with slide and fade
 */
@OptIn(ExperimentalAnimationApi::class)
@Composable
fun AnimatedListItem(
    visible: Boolean = true,
    content: @Composable AnimatedVisibilityScope.() -> Unit
) {
    AnimatedVisibility(
        visible = visible,
        enter = slideInVertically(
            initialOffsetY = { -40 },
            animationSpec = spring(
                dampingRatio = Spring.DampingRatioMediumBouncy,
                stiffness = Spring.StiffnessLow
            )
        ) + fadeIn(
            animationSpec = tween(300)
        ),
        exit = slideOutVertically(
            targetOffsetY = { -40 },
            animationSpec = tween(200)
        ) + fadeOut(
            animationSpec = tween(200)
        ),
        content = content
    )
}

/**
 * Scale animation for buttons and interactive elements
 */
@Composable
fun Modifier.pressAnimation(): Modifier {
    var pressed by remember { mutableStateOf(false) }
    val scale by animateFloatAsState(
        targetValue = if (pressed) 0.95f else 1f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessMedium
        ),
        label = "press_scale"
    )

    return this.graphicsLayer {
        scaleX = scale
        scaleY = scale
    }
}

/**
 * Shimmer effect for loading states
 */
@Composable
fun Modifier.shimmerEffect(): Modifier {
    val transition = rememberInfiniteTransition(label = "shimmer")
    val alpha by transition.animateFloat(
        initialValue = 0.3f,
        targetValue = 0.9f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "shimmer_alpha"
    )

    return this.graphicsLayer {
        this.alpha = alpha
    }
}

/**
 * Slide in from bottom animation for dialogs
 */
fun slideInFromBottom(): EnterTransition {
    return slideInVertically(
        initialOffsetY = { it },
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessMedium
        )
    ) + fadeIn(
        animationSpec = tween(300)
    )
}

/**
 * Slide out to bottom animation for dialogs
 */
fun slideOutToBottom(): ExitTransition {
    return slideOutVertically(
        targetOffsetY = { it },
        animationSpec = tween(250)
    ) + fadeOut(
        animationSpec = tween(250)
    )
}

/**
 * Expand/collapse animation for expandable content
 */
@Composable
fun ExpandableContent(
    expanded: Boolean,
    content: @Composable () -> Unit
) {
    AnimatedVisibility(
        visible = expanded,
        enter = expandVertically(
            animationSpec = spring(
                dampingRatio = Spring.DampingRatioMediumBouncy,
                stiffness = Spring.StiffnessMedium
            )
        ) + fadeIn(),
        exit = shrinkVertically(
            animationSpec = tween(200)
        ) + fadeOut(),
        content = { content() }
    )
}

/**
 * Rotation animation for refresh indicators
 */
@Composable
fun Modifier.rotateAnimation(rotating: Boolean): Modifier {
    val rotation by animateFloatAsState(
        targetValue = if (rotating) 360f else 0f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "rotation"
    )

    return this.graphicsLayer {
        rotationZ = rotation
    }
}

/**
 * Bounce animation for success feedback
 */
@Composable
fun Modifier.bounceAnimation(trigger: Boolean): Modifier {
    val scale by animateFloatAsState(
        targetValue = if (trigger) 1.2f else 1f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioHighBouncy,
            stiffness = Spring.StiffnessMedium
        ),
        label = "bounce_scale"
    )

    return this.graphicsLayer {
        scaleX = scale
        scaleY = scale
    }
}

/**
 * Fade through animation for content changes
 */
@Composable
fun <T> FadeThroughContent(
    targetState: T,
    content: @Composable (T) -> Unit
) {
    Crossfade(
        targetState = targetState,
        animationSpec = tween(300),
        label = "fade_through"
    ) { state ->
        content(state)
    }
}
