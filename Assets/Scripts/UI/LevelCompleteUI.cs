using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class LevelCompleteUI : MonoBehaviour
{
    [Header("UI Elements")]
    [SerializeField] private Button nextLevelButton;
    [SerializeField] private Button retryButton;
    [SerializeField] private TextMeshProUGUI levelCompleteText;
    [SerializeField] private TextMeshProUGUI timeText;
    
    [Header("References")]
    [SerializeField] private GameManager gameManager;
    
    private void Start()
    {
        if (gameManager == null)
            gameManager = FindObjectOfType<GameManager>();
            
        if (nextLevelButton != null)
            nextLevelButton.onClick.AddListener(OnNextLevelClicked);
            
        if (retryButton != null)
            retryButton.onClick.AddListener(OnRetryClicked);
    }
    
    public void Show(int level, float completionTime)
    {
        gameObject.SetActive(true);
        
        if (levelCompleteText != null)
            levelCompleteText.text = $"Level {level} Complete!";
            
        if (timeText != null)
            timeText.text = $"Time: {completionTime:F1}s";
    }
    
    private void OnNextLevelClicked()
    {
        if (gameManager != null)
            gameManager.LoadNextLevel();
    }
    
    private void OnRetryClicked()
    {
        if (gameManager != null)
            gameManager.RestartLevel();
    }
} 