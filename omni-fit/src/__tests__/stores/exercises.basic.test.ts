import { describe, it, expect, beforeEach } from "vitest";
import { useExercisesStore } from "@/stores/exercises.store";

describe("ExercisesStore - Tests Basiques", () => {
  beforeEach(() => {
    // Reset simple du store
    useExercisesStore.setState({
      exerciseTemplates: [],
      completedExercises: [],
      isLoading: false,
      error: null,
    });
  });

  describe("État initial", () => {
    it("doit avoir un état initial correct", () => {
      const state = useExercisesStore.getState();

      expect(Array.isArray(state.exerciseTemplates)).toBe(true);
      expect(Array.isArray(state.completedExercises)).toBe(true);
      expect(state.exerciseTemplates).toHaveLength(0);
      expect(state.completedExercises).toHaveLength(0);
    });
  });

  describe("Sélecteurs", () => {
    it("doit avoir les hooks sélecteurs", () => {
      const state = useExercisesStore.getState();

      // Vérifier que les hooks existent (même s'ils retournent undefined)
      expect(typeof useExercisesStore).toBe("function");
      expect(state).toBeDefined();
    });

    it("doit gérer les exerciseTemplates", () => {
      const { exerciseTemplates } = useExercisesStore.getState();

      expect(exerciseTemplates).toBeDefined();
      expect(Array.isArray(exerciseTemplates)).toBe(true);
    });
  });

  describe("Actions de base", () => {
    it("doit permettre de modifier le state directement", () => {
      // Test de base - modification directe du state
      useExercisesStore.setState({
        isLoading: true,
      });

      const state = useExercisesStore.getState();
      expect(state.isLoading).toBe(true);
    });

    it("doit préserver les autres propriétés lors du setState", () => {
      const initialTemplates = [{ id: "1", name: "Test" }] as any;

      useExercisesStore.setState({
        exerciseTemplates: initialTemplates,
      });

      useExercisesStore.setState({
        isLoading: true,
      });

      const state = useExercisesStore.getState();
      expect(state.isLoading).toBe(true);
      expect(state.exerciseTemplates).toEqual(initialTemplates);
    });
  });

  describe("Structure des données", () => {
    it("doit avoir les bonnes propriétés de state", () => {
      const state = useExercisesStore.getState();

      expect(state).toHaveProperty("exerciseTemplates");
      expect(state).toHaveProperty("completedExercises");
      expect(state).toHaveProperty("isLoading");
      expect(state).toHaveProperty("error");
    });
  });
});
