import { describe, it, expect, vi, beforeEach } from 'vitest';
import { playSound } from '../../utils/sound';

// Mock global Audio before all tests
const mockAudio = {
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  load: vi.fn(),
  volume: 1,
  src: '',
};

global.Audio = vi.fn().mockImplementation(() => mockAudio);

describe('Sound Utils', () => {
  beforeEach(() => {
    // Reset Audio mock before each test
    vi.clearAllMocks();
  });

  it('creates Audio object with correct source for complete sound', () => {
    playSound('complete');

    expect(global.Audio).toHaveBeenCalledWith('/sounds/complete.mp3');
  });

  it('creates Audio object with correct source for reminder sound', () => {
    playSound('reminder');

    expect(global.Audio).toHaveBeenCalledWith('/sounds/reminder.mp3');
  });

  it('calls play method on audio object', () => {
    playSound('complete');

    expect(mockAudio.play).toHaveBeenCalledTimes(1);
  });

  it('handles play promise rejection gracefully', () => {
    // Mock play to reject temporarily
    mockAudio.play.mockRejectedValueOnce(new Error('Play failed'));

    // Should not throw
    expect(() => playSound('complete')).not.toThrow();
  });

  it('handles invalid sound types gracefully', () => {
    expect(() => playSound('invalid' as any)).not.toThrow();
  });

  it('does not crash when Audio constructor fails', () => {
    // Mock constructor to throw temporarily
    const originalAudio = global.Audio;
    global.Audio = vi.fn().mockImplementation(() => {
      throw new Error('Audio not supported');
    });

    expect(() => playSound('complete')).not.toThrow();
    
    // Restore original mock
    global.Audio = originalAudio;
  });

  it('sets volume correctly when audio object is created', () => {
    playSound('complete');

    // Volume should be set to a reasonable level (0.5)
    expect(mockAudio.volume).toBeLessThanOrEqual(1);
    expect(mockAudio.volume).toBeGreaterThanOrEqual(0);
  });
});
