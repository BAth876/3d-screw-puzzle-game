using UnityEngine;
using UnityEngine.InputSystem;
using System;

public class ObjectInteraction : MonoBehaviour
{
    [Header("Camera Settings")]
    [SerializeField] private Camera mainCamera;
    [SerializeField] private float raycastDistance = 10f;
    [SerializeField] private LayerMask interactableLayer;
    
    [Header("Interaction Settings")]
    [SerializeField] private float holdTime = 0.5f;
    [SerializeField] private float currentHoldTime = 0f;
    
    [Header("References")]
    [SerializeField] private InputManager inputManager;
    
    // Events for UI feedback
    public event Action<float> OnHoldProgressChanged;
    public event Action<Vector3> OnObjectSelected;
    public event Action OnObjectDeselected;
    
    private ScrewableObject selectedObject;
    private bool isHolding = false;
    
    private void Start()
    {
        if (mainCamera == null)
            mainCamera = Camera.main;
            
        if (inputManager == null)
            inputManager = FindObjectOfType<InputManager>();
            
        if (inputManager != null)
        {
            inputManager.OnClick += HandleClick;
            inputManager.OnRelease += HandleRelease;
        }
    }
    
    private void HandleClick(Vector2 position)
    {
        Ray ray = mainCamera.ScreenPointToRay(position);
        RaycastHit hit;
        
        if (Physics.Raycast(ray, out hit, raycastDistance, interactableLayer))
        {
            ScrewableObject screwable = hit.collider.GetComponent<ScrewableObject>();
            
            if (screwable != null)
            {
                if (selectedObject != screwable)
                {
                    selectedObject = screwable;
                    currentHoldTime = 0f;
                    OnObjectSelected?.Invoke(hit.point);
                }
            }
        }
    }
    
    private void HandleRelease(Vector2 position)
    {
        if (isHolding)
        {
            StopUnscrewing();
        }
        
        if (selectedObject != null)
        {
            OnObjectDeselected?.Invoke();
        }
        
        selectedObject = null;
        currentHoldTime = 0f;
        OnHoldProgressChanged?.Invoke(0f);
    }
    
    private void Update()
    {
        if (selectedObject != null && isHolding)
        {
            currentHoldTime += Time.deltaTime;
            float progress = Mathf.Clamp01(currentHoldTime / holdTime);
            OnHoldProgressChanged?.Invoke(progress);
            
            if (currentHoldTime >= holdTime)
            {
                StartUnscrewing();
            }
        }
    }
    
    private void StartUnscrewing()
    {
        if (selectedObject != null)
        {
            isHolding = true;
            selectedObject.StartUnscrewing();
        }
    }
    
    private void StopUnscrewing()
    {
        if (selectedObject != null)
        {
            isHolding = false;
            selectedObject.StopUnscrewing();
        }
    }
    
    private void OnDestroy()
    {
        if (inputManager != null)
        {
            inputManager.OnClick -= HandleClick;
            inputManager.OnRelease -= HandleRelease;
        }
    }
} 