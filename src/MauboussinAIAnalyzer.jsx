import React, { useState } from 'react';
import { Building2, TrendingUp, Shield, Users, Brain, Target, Search, Loader, Star, AlertCircle, Download, ChevronDown, ChevronUp } from 'lucide-react';

const MauboussinAIAnalyzer = () => {
  const [companyName, setCompanyName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    moat: true,
    expectations: true,
    probabilistic: true,
    management: true,
    conclusion: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const analyzeCompany = async () => {
    if (!companyName.trim()) {
      setError('Please enter a company name');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-company`;

      const searchResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName }),
      });

      if (!searchResponse.ok) {
        const errorData = await searchResponse.json();
        throw new Error(errorData.error || `Analysis failed: ${searchResponse.status}`);
      }

      const analysisData = await searchResponse.json();
      setAnalysis(analysisData);
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError(`Failed to analyze company: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateMoatScore = (moatAssessment) => {
    if (!moatAssessment) return 0;
    const scores = [
      moatAssessment.supplyScale?.score || 0,
      moatAssessment.networkEffects?.score || 0,
      moatAssessment.switchingCosts?.score || 0,
      moatAssessment.intangibles?.score || 0,
      moatAssessment.costAdvantages?.score || 0
    ];
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };

  const getMoatColor = (rating) => {
    if (rating === 'Wide Moat') return { text: 'text-green-600', bg: 'bg-green-100', border: 'border-green-600' };
    if (rating === 'Narrow Moat') return { text: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-600' };
    return { text: 'text-red-600', bg: 'bg-red-100', border: 'border-red-600' };
  };

  const getTrajectoryEmoji = (trajectory) => {
    if (trajectory === 'Strengthening') return '📈';
    if (trajectory === 'Weakening') return '📉';
    return '➡️';
  };

  const StarDisplay = ({ score }) => {
    return (
      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={star <= score ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {score === 1 && 'Very Weak'}
          {score === 2 && 'Weak'}
          {score === 3 && 'Moderate'}
          {score === 4 && 'Strong'}
          {score === 5 && 'Very Strong'}
        </span>
      </div>
    );
  };

  const exportAnalysis = () => {
    if (!analysis) return;

    const moatScore = calculateMoatScore(analysis.moatAssessment);
    
    const report = `
MAUBOUSSIN COMPETITIVE ANALYSIS
Company: ${analysis.companyName}
Generated: ${new Date().toLocaleDateString()}
Analyzed by Claude AI using Michael Mauboussin's investment frameworks

═══════════════════════════════════════════════════════════

EXECUTIVE SUMMARY
───────────────────────────────────────────────────────────
Company: ${analysis.companyName}
Industry: ${analysis.industry}
Business Model: ${analysis.businessModel}

Overall Moat: ${analysis.moatAssessment.overallRating} (${moatScore}/5.0)
Trajectory: ${analysis.moatAssessment.trajectory} ${getTrajectoryEmoji(analysis.moatAssessment.trajectory)}

Investment Thesis:
${analysis.conclusion.investmentThesis}

═══════════════════════════════════════════════════════════

COMPETITIVE MOAT ASSESSMENT
───────────────────────────────────────────────────────────

Overall Assessment: ${analysis.moatAssessment.moatSummary}

Detailed Evaluation:

1. SUPPLY-SIDE ECONOMIES OF SCALE (${analysis.moatAssessment.supplyScale.score}/5)
${analysis.moatAssessment.supplyScale.assessment}

2. NETWORK EFFECTS (${analysis.moatAssessment.networkEffects.score}/5)
${analysis.moatAssessment.networkEffects.assessment}

3. SWITCHING COSTS (${analysis.moatAssessment.switchingCosts.score}/5)
${analysis.moatAssessment.switchingCosts.assessment}

4. INTANGIBLE ASSETS (${analysis.moatAssessment.intangibles.score}/5)
${analysis.moatAssessment.intangibles.assessment}

5. COST ADVANTAGES (${analysis.moatAssessment.costAdvantages.score}/5)
${analysis.moatAssessment.costAdvantages.assessment}

═══════════════════════════════════════════════════════════

EXPECTATIONS INVESTING ANALYSIS
───────────────────────────────────────────────────────────

Current Valuation:
${analysis.expectations.currentValuation}

What's Priced In:
${analysis.expectations.impliedExpectations}

Positive Revision Triggers:
${analysis.expectations.upwardTriggers}

Negative Revision Triggers:
${analysis.expectations.downwardTriggers}

Valuation Assessment:
${analysis.expectations.valuationAssessment}

═══════════════════════════════════════════════════════════

PROBABILISTIC ASSESSMENT
───────────────────────────────────────────────────────────

Base Rate Analysis:
${analysis.probabilistic.baseRate}

Range of Outcomes:
${analysis.probabilistic.outcomeRange}

Skill vs. Luck:
${analysis.probabilistic.skillVsLuck}

Key Uncertainties:
${analysis.probabilistic.keyUncertainties}

═══════════════════════════════════════════════════════════

MANAGEMENT & CAPITAL ALLOCATION
───────────────────────────────────────────────────────────

Capital Allocation:
${analysis.management.capitalAllocation}

Strategic Thinking:
${analysis.management.strategicThinking}

Overall Assessment:
${analysis.management.overallAssessment}

═══════════════════════════════════════════════════════════

CONCLUSION
───────────────────────────────────────────────────────────

Investment Thesis:
${analysis.conclusion.investmentThesis}

Key Risks:
${analysis.conclusion.keyRisks}

What Would Change the Thesis:
${analysis.conclusion.whatWouldChange}

Recommendation:
${analysis.conclusion.recommendation}

═══════════════════════════════════════════════════════════

MAUBOUSSIN FRAMEWORK APPLIED
───────────────────────────────────────────────────────────
✓ Competitive advantage assessed across five dimensions
✓ Current expectations reverse-engineered from valuation
✓ Probabilistic thinking applied (distributions, not points)
✓ Base rates considered for outside view
✓ Skill vs. luck analysis conducted
✓ Management capital allocation evaluated
✓ Key risks and disconfirming evidence identified
✓ Clear thesis and revision criteria established

═══════════════════════════════════════════════════════════

"The big money is not in the buying or selling, but in the waiting."
— Charlie Munger

This analysis was generated using Michael Mauboussin's investment
frameworks including competitive moat assessment, expectations investing,
and probabilistic thinking.
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analysis.companyName.replace(/[^a-z0-9]/gi, '_')}_mauboussin_analysis.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12 px-6 shadow-2xl">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Brain size={48} className="text-blue-200" />
            <h1 className="text-5xl font-bold">Mauboussin AI Analyzer</h1>
          </div>
          <p className="text-xl text-blue-100 mb-2">
            AI-Powered Competitive Advantage Analysis
          </p>
          <p className="text-sm text-blue-200">
            Using Michael Mauboussin's frameworks: moats, expectations investing, and probabilistic thinking
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <Search className="text-purple-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">Analyze a Company</h2>
          </div>
          
          <div className="flex gap-4">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && analyzeCompany()}
              placeholder="Enter company name (e.g., Apple, Tesla, Costco)..."
              className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all"
              disabled={isAnalyzing}
            />
            <button
              onClick={analyzeCompany}
              disabled={isAnalyzing}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader className="animate-spin" size={24} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain size={24} />
                  Analyze
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            <p>💡 <strong>Pro tip:</strong> The AI will search for current information, analyze competitive advantages, assess expectations, and provide probabilistic scenarios.</p>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Executive Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{analysis.companyName}</h2>
                  <p className="text-gray-600">{analysis.industry}</p>
                  <p className="text-gray-700 mt-2">{analysis.businessModel}</p>
                </div>
                <Building2 size={64} className="text-blue-600" />
              </div>

              {/* Moat Summary Box */}
              <div className={`${getMoatColor(analysis.moatAssessment.overallRating).bg} border-2 ${getMoatColor(analysis.moatAssessment.overallRating).border} rounded-xl p-6 mt-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield size={32} className={getMoatColor(analysis.moatAssessment.overallRating).text} />
                      <div>
                        <p className="text-sm text-gray-600">Competitive Moat</p>
                        <p className={`text-3xl font-bold ${getMoatColor(analysis.moatAssessment.overallRating).text}`}>
                          {analysis.moatAssessment.overallRating}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Overall Score:</strong> {calculateMoatScore(analysis.moatAssessment)} / 5.0
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Trajectory:</strong> {analysis.moatAssessment.trajectory} {getTrajectoryEmoji(analysis.moatAssessment.trajectory)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t-2 border-gray-300">
                  <p className="text-gray-800">{analysis.moatAssessment.moatSummary}</p>
                </div>
              </div>
            </div>

            {/* Competitive Moat Details */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-green-200">
              <button
                onClick={() => toggleSection('moat')}
                className="w-full px-8 py-6 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all flex items-center justify-between border-b-2 border-green-200"
              >
                <div className="flex items-center gap-3">
                  <Shield size={28} className="text-green-600" />
                  <h3 className="text-2xl font-bold text-gray-800">Competitive Moat Assessment</h3>
                </div>
                {expandedSections.moat ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>

              {expandedSections.moat && (
                <div className="p-8 space-y-6">
                  {/* Supply Scale */}
                  <div className="border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-gray-800">Supply-Side Economies of Scale</h4>
                      <StarDisplay score={analysis.moatAssessment.supplyScale.score} />
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.moatAssessment.supplyScale.assessment}</p>
                  </div>

                  {/* Network Effects */}
                  <div className="border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-gray-800">Network Effects</h4>
                      <StarDisplay score={analysis.moatAssessment.networkEffects.score} />
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.moatAssessment.networkEffects.assessment}</p>
                  </div>

                  {/* Switching Costs */}
                  <div className="border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-gray-800">Switching Costs</h4>
                      <StarDisplay score={analysis.moatAssessment.switchingCosts.score} />
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.moatAssessment.switchingCosts.assessment}</p>
                  </div>

                  {/* Intangibles */}
                  <div className="border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-gray-800">Intangible Assets</h4>
                      <StarDisplay score={analysis.moatAssessment.intangibles.score} />
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.moatAssessment.intangibles.assessment}</p>
                  </div>

                  {/* Cost Advantages */}
                  <div className="border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-gray-800">Cost Advantages</h4>
                      <StarDisplay score={analysis.moatAssessment.costAdvantages.score} />
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.moatAssessment.costAdvantages.assessment}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Expectations Analysis */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-purple-200">
              <button
                onClick={() => toggleSection('expectations')}
                className="w-full px-8 py-6 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all flex items-center justify-between border-b-2 border-purple-200"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp size={28} className="text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-800">Expectations Investing Analysis</h3>
                </div>
                {expandedSections.expectations ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>

              {expandedSections.expectations && (
                <div className="p-8 space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Current Valuation</h4>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.expectations.currentValuation}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">What's Priced In</h4>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.expectations.impliedExpectations}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border-2 border-green-200 rounded-xl p-4 bg-green-50">
                      <h4 className="text-lg font-bold text-green-800 mb-2">📈 Upward Triggers</h4>
                      <p className="text-gray-700 whitespace-pre-line">{analysis.expectations.upwardTriggers}</p>
                    </div>
                    <div className="border-2 border-red-200 rounded-xl p-4 bg-red-50">
                      <h4 className="text-lg font-bold text-red-800 mb-2">📉 Downward Triggers</h4>
                      <p className="text-gray-700 whitespace-pre-line">{analysis.expectations.downwardTriggers}</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <h4 className="text-lg font-bold text-blue-800 mb-2">Valuation Assessment</h4>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.expectations.valuationAssessment}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Probabilistic Assessment */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-indigo-200">
              <button
                onClick={() => toggleSection('probabilistic')}
                className="w-full px-8 py-6 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition-all flex items-center justify-between border-b-2 border-indigo-200"
              >
                <div className="flex items-center gap-3">
                  <Brain size={28} className="text-indigo-600" />
                  <h3 className="text-2xl font-bold text-gray-800">Probabilistic Assessment</h3>
                </div>
                {expandedSections.probabilistic ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>

              {expandedSections.probabilistic && (
                <div className="p-8 space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Base Rate Analysis</h4>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.probabilistic.baseRate}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Range of Outcomes</h4>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.probabilistic.outcomeRange}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Skill vs. Luck</h4>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.probabilistic.skillVsLuck}</p>
                  </div>
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                    <h4 className="text-lg font-bold text-yellow-800 mb-2">⚠️ Key Uncertainties</h4>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.probabilistic.keyUncertainties}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Management */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-cyan-200">
              <button
                onClick={() => toggleSection('management')}
                className="w-full px-8 py-6 bg-gradient-to-r from-cyan-50 to-teal-50 hover:from-cyan-100 hover:to-teal-100 transition-all flex items-center justify-between border-b-2 border-cyan-200"
              >
                <div className="flex items-center gap-3">
                  <Users size={28} className="text-cyan-600" />
                  <h3 className="text-2xl font-bold text-gray-800">Management & Capital Allocation</h3>
                </div>
                {expandedSections.management ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>

              {expandedSections.management && (
                <div className="p-8 space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Capital Allocation Track Record</h4>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.management.capitalAllocation}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Strategic Thinking</h4>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.management.strategicThinking}</p>
                  </div>
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <h4 className="text-lg font-bold text-green-800 mb-2">Overall Assessment</h4>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.management.overallAssessment}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Conclusion */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-200">
              <button
                onClick={() => toggleSection('conclusion')}
                className="w-full px-8 py-6 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all flex items-center justify-between border-b-2 border-orange-200"
              >
                <div className="flex items-center gap-3">
                  <Target size={28} className="text-orange-600" />
                  <h3 className="text-2xl font-bold text-gray-800">Investment Conclusion</h3>
                </div>
                {expandedSections.conclusion ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>

              {expandedSections.conclusion && (
                <div className="p-8 space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-blue-900 mb-2">💡 Investment Thesis</h4>
                    <p className="text-gray-800 text-lg whitespace-pre-line">{analysis.conclusion.investmentThesis}</p>
                  </div>
                  <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
                    <h4 className="text-lg font-bold text-red-900 mb-2">⚠️ Key Risks</h4>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.conclusion.keyRisks}</p>
                  </div>
                  <div className="border-2 border-yellow-200 rounded-xl p-6 bg-yellow-50">
                    <h4 className="text-lg font-bold text-yellow-900 mb-2">🔄 What Would Change the Thesis</h4>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.conclusion.whatWouldChange}</p>
                  </div>
                  <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
                    <h4 className="text-lg font-bold text-green-900 mb-2">📊 Recommendation Context</h4>
                    <p className="text-gray-700 whitespace-pre-line">{analysis.conclusion.recommendation}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Export Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={exportAnalysis}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-2xl hover:shadow-xl"
              >
                <Download size={24} />
                Export Complete Analysis Report
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        {!isAnalyzing && !analysis && (
          <div className="text-center mt-12 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">How This Works</h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="space-y-2">
                  <div className="text-3xl">🔍</div>
                  <h4 className="font-bold text-gray-800">Research</h4>
                  <p className="text-sm text-gray-600">AI searches for current company information, financials, and competitive position</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl">🧠</div>
                  <h4 className="font-bold text-gray-800">Analyze</h4>
                  <p className="text-sm text-gray-600">Applies Mauboussin's frameworks: moats, expectations investing, probabilistic thinking</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl">📊</div>
                  <h4 className="font-bold text-gray-800">Report</h4>
                  <p className="text-sm text-gray-600">Generates comprehensive analysis with scores, scenarios, and investment thesis</p>
                </div>
              </div>
            </div>
            
            <blockquote className="text-gray-600 italic text-lg">
              "The big money is not in the buying or selling, but in the waiting."
              <br />
              <span className="text-gray-500 text-base">— Charlie Munger</span>
            </blockquote>
          </div>
        )}
      </div>
    </div>
  );
};

export default MauboussinAIAnalyzer;
