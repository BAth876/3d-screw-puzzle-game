using UnityEngine;

public class CameraController : MonoBehaviour
{
    [Header("Camera Settings")]
    [SerializeField] private float rotationSpeed = 2f;
    [SerializeField] private float zoomSpeed = 2f;
    [SerializeField] private float minZoom = 2f;
    [SerializeField] private float maxZoom = 10f;
    
    [Header("References")]
    [SerializeField] private InputManager inputManager;
    [SerializeField] private Transform target;
    
    private float currentZoom;
    private Vector3 offset;
    
    private void Start()
    {
        if (inputManager == null)
            inputManager = FindObjectOfType<InputManager>();
            
        if (inputManager != null)
        {
            inputManager.OnMouseMove += HandleRotation;
            inputManager.OnZoom += HandleZoom;
        }
        
        if (target != null)
        {
            offset = transform.position - target.position;
            currentZoom = offset.magnitude;
        }
    }
    
    private void LateUpdate()
    {
        if (target != null)
        {
            // Update camera position based on target and zoom
            transform.position = target.position + offset.normalized * currentZoom;
            
            // Make camera look at target
            transform.LookAt(target.position);
        }
    }
    
    private void HandleRotation(Vector2 delta)
    {
        if (target != null)
        {
            // Rotate around the target
            transform.RotateAround(target.position, Vector3.up, delta.x * rotationSpeed);
            transform.RotateAround(target.position, transform.right, -delta.y * rotationSpeed);
            
            // Update offset after rotation
            offset = transform.position - target.position;
        }
    }
    
    private void HandleZoom(float zoomValue)
    {
        if (target != null)
        {
            // Update zoom level
            currentZoom = Mathf.Clamp(currentZoom - zoomValue * zoomSpeed, minZoom, maxZoom);
        }
    }
    
    private void OnDestroy()
    {
        if (inputManager != null)
        {
            inputManager.OnMouseMove -= HandleRotation;
            inputManager.OnZoom -= HandleZoom;
        }
    }
} 