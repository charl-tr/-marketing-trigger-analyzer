from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class TriggerType(str, Enum):
    URGENCY = "urgency"
    SCARCITY = "scarcity"
    SOCIAL_PROOF = "social_proof"
    AUTHORITY = "authority"
    FEAR = "fear"
    EXCLUSIVITY = "exclusivity"
    STORYTELLING = "storytelling"
    CONTRAST = "contrast"
    CALL_TO_ACTION = "call_to_action"
    LOSS_AVERSION = "loss_aversion"

class TriggerMatch(BaseModel):
    start: int = Field(..., description="Position de début du passage (inclusive)")
    end: int = Field(..., description="Position de fin du passage (exclusive)")
    text: str = Field(..., description="Texte extrait du passage")
    comment: str = Field(..., description="Explication de pourquoi ce passage correspond au trigger")
    trigger: TriggerType = Field(..., description="Type de trigger détecté")
    intensity: float = Field(..., ge=0, le=1, description="Intensité du trigger (0-1)")

class AnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Texte à analyser")
    triggers: List[TriggerType] = Field(..., min_items=1, description="Liste des triggers à analyser")
    api_key: str = Field(..., description="Clé API OpenAI")

class AnalysisResponse(BaseModel):
    matches: List[TriggerMatch] = Field(..., description="Liste des passages détectés")
    total_matches: int = Field(..., description="Nombre total de matches trouvés")
    triggers_analyzed: List[TriggerType] = Field(..., description="Triggers analysés")
    text_length: int = Field(..., description="Longueur du texte analysé")

class ErrorResponse(BaseModel):
    error: str = Field(..., description="Message d'erreur")
    details: Optional[str] = Field(None, description="Détails supplémentaires de l'erreur")
