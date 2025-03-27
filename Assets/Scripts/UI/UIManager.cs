using UnityEngine;
using TMPro;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    [Header("Level UI")]
    [SerializeField] private GameObject levelCompletePanel;
    [SerializeField] private GameObject gameCompletePanel;
    [SerializeField] private TextMeshProUGUI levelText;
    [SerializeField] private TextMeshProUGUI piecesRemainingText;
    
    [Header("Interaction UI")]
    [SerializeField] private GameObject holdIndicator;
    [SerializeField] private Image holdProgressBar;
    [SerializeField] private float holdIndicatorOffset = 50f;
    
    [Header("References")]
    [SerializeField] private Camera mainCamera;
    [SerializeField] private ObjectInteraction objectInteraction;
    
    private void Start()
    {
        if (mainCamera == null)
            mainCamera = Camera.main;
            
        if (objectInteraction == null)
            objectInteraction = FindObjectOfType<ObjectInteraction>();
            
        // Subscribe to events
        if (objectInteraction != null)
        {
            objectInteraction.OnHoldProgressChanged += UpdateHoldProgress;
            objectInteraction.OnObjectSelected += ShowHoldIndicator;
            objectInteraction.OnObjectDeselected += HideHoldIndicator;
        }
    }
    
    public void ShowLevelComplete()
    {
        levelCompletePanel.SetActive(true);
    }
    
    public void ShowGameComplete()
    {
        gameCompletePanel.SetActive(true);
    }
    
    public void UpdateLevelText(int level)
    {
        if (levelText != null)
            levelText.text = $"Level {level}";
    }
    
    public void UpdatePiecesRemaining(int remaining, int total)
    {
        if (piecesRemainingText != null)
            piecesRemainingText.text = $"Pieces: {remaining}/{total}";
    }
    
    private void UpdateHoldProgress(float progress)
    {
        if (holdProgressBar != null)
            holdProgressBar.fillAmount = progress;
    }
    
    private void ShowHoldIndicator(Vector3 position)
    {
        if (holdIndicator != null)
        {
            holdIndicator.SetActive(true);
            Vector3 screenPos = mainCamera.WorldToScreenPoint(position);
            holdIndicator.transform.position = screenPos + Vector3.up * holdIndicatorOffset;
        }
    }
    
    private void HideHoldIndicator()
    {
        if (holdIndicator != null)
            holdIndicator.SetActive(false);
    }
    
    private void OnDestroy()
    {
        if (objectInteraction != null)
        {
            objectInteraction.OnHoldProgressChanged -= UpdateHoldProgress;
            objectInteraction.OnObjectSelected -= ShowHoldIndicator;
            objectInteraction.OnObjectDeselected -= HideHoldIndicator;
        }
    }
} 