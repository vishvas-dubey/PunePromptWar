const ragService = require('../rag_service');

describe('RAG Service Logic', () => {
  
  test('cosineSimilarity should return 1 for identical vectors', () => {
    const v1 = [1, 0, 0];
    const v2 = [1, 0, 0];
    expect(ragService.cosineSimilarity(v1, v2)).toBeCloseTo(1);
  });

  test('cosineSimilarity should return 0 for orthogonal vectors', () => {
    const v1 = [1, 0, 0];
    const v2 = [0, 1, 0];
    expect(ragService.cosineSimilarity(v1, v2)).toBeCloseTo(0);
  });

  test('vectorStore should be empty initially', () => {
    expect(ragService.getVectorStore()).toEqual([]);
  });

});
