using UnityEngine;

public class ScrewableObjectVisuals : MonoBehaviour
{
    [Header("Visual Settings")]
    [SerializeField] private Material defaultMaterial;
    [SerializeField] private Material highlightMaterial;
    [SerializeField] private Material unscrewingMaterial;
    [SerializeField] private float highlightIntensity = 1.2f;
    
    [Header("References")]
    [SerializeField] private ScrewableObject screwableObject;
    [SerializeField] private MeshRenderer meshRenderer;
    
    private Material originalMaterial;
    
    private void Start()
    {
        if (meshRenderer == null)
            meshRenderer = GetComponent<MeshRenderer>();
            
        if (meshRenderer != null)
            originalMaterial = meshRenderer.material;
    }
    
    public void OnObjectSelected()
    {
        if (meshRenderer != null)
        {
            if (highlightMaterial != null)
                meshRenderer.material = highlightMaterial;
            else
                meshRenderer.material.color = originalMaterial.color * highlightIntensity;
        }
    }
    
    public void OnObjectDeselected()
    {
        if (meshRenderer != null)
            meshRenderer.material = originalMaterial;
    }
    
    public void OnStartUnscrewing()
    {
        if (meshRenderer != null && unscrewingMaterial != null)
            meshRenderer.material = unscrewingMaterial;
    }
    
    public void OnStopUnscrewing()
    {
        if (meshRenderer != null)
            meshRenderer.material = originalMaterial;
    }
    
    public void OnFullyUnscrewed()
    {
        if (meshRenderer != null)
        {
            // You can add special effects here for when the object is fully unscrewed
            meshRenderer.material.color = new Color(0.5f, 0.5f, 0.5f, 1f); // Gray out the object
        }
    }
} 