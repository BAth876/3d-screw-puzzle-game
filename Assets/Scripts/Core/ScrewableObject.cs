using UnityEngine;

public class ScrewableObject : MonoBehaviour
{
    [Header("Screw Settings")]
    [SerializeField] private float screwSpeed = 100f;
    [SerializeField] private float unscrewThreshold = 0.8f;
    [SerializeField] private float screwProgress = 0f;
    
    [Header("References")]
    [SerializeField] private Transform screwAxis;
    [SerializeField] private Rigidbody rb;
    
    private bool isBeingUnscrewed = false;
    private Vector3 initialPosition;
    private Quaternion initialRotation;
    
    private void Start()
    {
        if (rb == null)
            rb = GetComponent<Rigidbody>();
            
        initialPosition = transform.position;
        initialRotation = transform.rotation;
    }
    
    public void StartUnscrewing()
    {
        isBeingUnscrewed = true;
        rb.isKinematic = false;
    }
    
    public void StopUnscrewing()
    {
        isBeingUnscrewed = false;
        rb.isKinematic = true;
    }
    
    private void Update()
    {
        if (isBeingUnscrewed)
        {
            // Rotate around the screw axis
            transform.RotateAround(screwAxis.position, screwAxis.up, screwSpeed * Time.deltaTime);
            
            // Move along the screw axis
            screwProgress += Time.deltaTime;
            transform.position = Vector3.Lerp(initialPosition, 
                initialPosition + screwAxis.forward * 2f, 
                screwProgress);
                
            // Check if fully unscrewed
            if (screwProgress >= unscrewThreshold)
            {
                OnFullyUnscrewed();
            }
        }
    }
    
    private void OnFullyUnscrewed()
    {
        // Disable the object's physics and mark it as unscrewed
        rb.isKinematic = true;
        isBeingUnscrewed = false;
        // You can add additional effects or game logic here
    }
    
    public bool IsFullyUnscrewed()
    {
        return screwProgress >= unscrewThreshold;
    }
} 