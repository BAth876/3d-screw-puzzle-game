using UnityEngine;
using UnityEngine.InputSystem;
using System;

public class InputManager : MonoBehaviour
{
    [Header("Input Settings")]
    [SerializeField] private float mouseSensitivity = 1f;
    [SerializeField] private float zoomSpeed = 2f;
    
    [Header("Camera Settings")]
    [SerializeField] private Camera mainCamera;
    [SerializeField] private float minZoom = 2f;
    [SerializeField] private float maxZoom = 10f;
    
    // Events
    public event Action<Vector2> OnMouseMove;
    public event Action<float> OnZoom;
    public event Action<Vector2> OnClick;
    public event Action<Vector2> OnRelease;
    
    private Vector2 lastMousePosition;
    private bool isDragging = false;
    
    private void Start()
    {
        if (mainCamera == null)
            mainCamera = Camera.main;
            
        // Subscribe to input events
        var input = GetComponent<PlayerInput>();
        if (input != null)
        {
            input.actions["MousePosition"].performed += OnMousePosition;
            input.actions["MouseClick"].performed += OnMouseClick;
            input.actions["MouseRelease"].performed += OnMouseRelease;
            input.actions["Zoom"].performed += OnZoomInput;
        }
    }
    
    private void OnMousePosition(InputAction.CallbackContext context)
    {
        Vector2 currentPosition = context.ReadValue<Vector2>();
        
        if (isDragging)
        {
            Vector2 delta = (currentPosition - lastMousePosition) * mouseSensitivity;
            OnMouseMove?.Invoke(delta);
        }
        
        lastMousePosition = currentPosition;
    }
    
    private void OnMouseClick(InputAction.CallbackContext context)
    {
        isDragging = true;
        OnClick?.Invoke(lastMousePosition);
    }
    
    private void OnMouseRelease(InputAction.CallbackContext context)
    {
        isDragging = false;
        OnRelease?.Invoke(lastMousePosition);
    }
    
    private void OnZoomInput(InputAction.CallbackContext context)
    {
        float zoomValue = context.ReadValue<float>();
        OnZoom?.Invoke(zoomValue);
    }
    
    private void OnDestroy()
    {
        var input = GetComponent<PlayerInput>();
        if (input != null)
        {
            input.actions["MousePosition"].performed -= OnMousePosition;
            input.actions["MouseClick"].performed -= OnMouseClick;
            input.actions["MouseRelease"].performed -= OnMouseRelease;
            input.actions["Zoom"].performed -= OnZoomInput;
        }
    }
} 