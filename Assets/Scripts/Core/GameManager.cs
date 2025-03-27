using UnityEngine;
using System.Collections.Generic;

public class GameManager : MonoBehaviour
{
    [Header("Puzzle Settings")]
    [SerializeField] private List<ScrewableObject> puzzlePieces;
    [SerializeField] private int currentLevel = 1;
    
    [Header("UI References")]
    [SerializeField] private GameObject levelCompleteUI;
    [SerializeField] private GameObject gameCompleteUI;
    [SerializeField] private UIManager uiManager;
    
    private int unscrewedPieces = 0;
    private float levelStartTime;
    private float levelCompletionTime;
    
    private void Start()
    {
        InitializeLevel();
    }
    
    private void InitializeLevel()
    {
        unscrewedPieces = 0;
        levelStartTime = Time.time;
        levelCompletionTime = 0f;
        
        foreach (var piece in puzzlePieces)
        {
            piece.Reset();
        }
        
        if (levelCompleteUI != null)
            levelCompleteUI.SetActive(false);
            
        if (gameCompleteUI != null)
            gameCompleteUI.SetActive(false);
            
        if (uiManager != null)
        {
            uiManager.UpdateLevelText(currentLevel);
            uiManager.UpdatePiecesRemaining(puzzlePieces.Count, puzzlePieces.Count);
        }
    }
    
    public void OnPieceUnscrewed()
    {
        unscrewedPieces++;
        
        if (uiManager != null)
            uiManager.UpdatePiecesRemaining(puzzlePieces.Count - unscrewedPieces, puzzlePieces.Count);
        
        if (unscrewedPieces >= puzzlePieces.Count)
        {
            levelCompletionTime = Time.time - levelStartTime;
            OnLevelComplete();
        }
    }
    
    private void OnLevelComplete()
    {
        if (levelCompleteUI != null)
        {
            var levelCompleteScript = levelCompleteUI.GetComponent<LevelCompleteUI>();
            if (levelCompleteScript != null)
            {
                levelCompleteScript.Show(currentLevel, levelCompletionTime);
            }
        }
    }
    
    public void LoadNextLevel()
    {
        currentLevel++;
        // Add logic to load the next level's puzzle pieces
        InitializeLevel();
    }
    
    public void RestartLevel()
    {
        InitializeLevel();
    }
    
    public void OnGameComplete()
    {
        if (gameCompleteUI != null)
            gameCompleteUI.SetActive(true);
    }
} 