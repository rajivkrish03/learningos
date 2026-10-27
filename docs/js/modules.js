/* ============================================================
   INTERACTIVE LEARNING LAB — Process Content in Data Cloud
   Zero → Expert journey for Salesforce Unstructured Data.

   Content is reorganized for natural learning flow (not source order).
   ============================================================ */

const MODULES = [

  /* ================================================================
     PHASE 1 — FOUNDATION: The Big Picture (Why & What)
     ================================================================ */

  /* ---------------- M1. WHY THIS EXISTS ---------------- */
  { id:'why', title:'Why This Exists', icon:'sparkles', steps:[
    { t:'intro',
      badge:'Zero → Expert',
      title:'Unstructured Data\nin Salesforce Data Cloud',
      subtitle:'From trapped PDFs and transcripts to AI-ready knowledge — a full learning journey.',
      body:`Most business knowledge is <b>trapped</b> — in PDFs, emails, call transcripts, support tickets, product manuals. Traditional systems can only search these by keyword. AI agents cannot understand or reason about them without help.<br><br>This course teaches you how Salesforce Data Cloud turns unstructured content into <b>AI-ready data</b> so your agents, analytics, and automations can act on the meaning inside every document. You'll leave able to design, build, tune, and troubleshoot production RAG solutions.`,
    },
    { t:'concept', eyebrow:'The Problem',
      title:'AI cannot reason about locked knowledge.',
      subtitle:'A generic LLM has no idea what your business knows.',
      ask:`If a customer asks your agent "How do I reset my LaserPrinter TX-400?" and the answer lives in a PDF manual — what will a generic LLM say?`,
      body:`Without your data, an LLM either <b>hallucinates</b> a plausible-sounding wrong answer, or refuses. It has no path to your PDFs, no memory of your Knowledge base, no access to yesterday's tickets. It is <i>ungrounded</i>.<br><br>Grounding = giving the model the exact passages it needs to answer correctly. That's what this course is about.`,
    },
    { t:'concept', eyebrow:'The Solution',
      title:'RAG — Retrieval Augmented Generation.',
      subtitle:'Retrieve → Augment → Generate.',
      ask:`Instead of hoping the LLM knows the answer, what if we first fetched the right paragraph from your data and handed it to the LLM?`,
      body:`RAG is a two-step pattern:<br><br>1. <b>Retrieve</b> the most relevant passages from your data (via search).<br>2. <b>Augment</b> the LLM prompt with those passages, then <b>Generate</b> the answer grounded in real evidence.<br><br>The output includes <b>citations</b> back to source chunks, so users can trust and verify. This is the core pattern behind grounded Agentforce agents.`,
    },
    { t:'concept', eyebrow:'Where You Will Apply This',
      title:'Five real use cases.',
      subtitle:'The same pipeline powers many outcomes.',
      ask:`Which of these matches your current work?`,
      body:`<ul style="margin-left:var(--space-4); margin-top:var(--space-2)">
        <li><b>Grounded Agents:</b> Agentforce answers customer questions from your Knowledge + PDFs.</li>
        <li><b>Service:</b> Auto-summarize tickets, extract themes, find similar past cases.</li>
        <li><b>Sales:</b> Digest call transcripts and emails into briefings and next-best-actions.</li>
        <li><b>Analytics:</b> Classify feedback and unlock topic trends in Tableau.</li>
        <li><b>Document Automation:</b> Extract fields from invoices, contracts, forms → clean structured records.</li>
      </ul>`,
    },
    { t:'quiz', eyebrow:'Quick Check', prompt:'What does the "R" in RAG stand for and why does it matter?',
      scn:`RAG is the mental model you'll use for the rest of this course.`,
      options:[
        {label:'Retrieval — fetch relevant passages before generating', correct:true, fb:'Correct. Retrieval grounds the LLM in your specific data, so answers are accurate and citable.'},
        {label:'Reasoning — the LLM thinks harder', correct:false, fb:'No. RAG is about giving the LLM real evidence, not asking it to think harder.'},
        {label:'Regeneration — retry until correct', correct:false, fb:'No. RAG solves the root cause (missing knowledge) instead of retrying blind guesses.'},
      ] },
  ]},

  /* ---------------- M2. CORE VOCABULARY ---------------- */
  { id:'vocab', title:'Core Vocabulary', icon:'book-open', steps:[
    { t:'concept', eyebrow:'The 6 Words You Need',
      title:'Learn the language once, use it forever.',
      subtitle:'Chunk, vector, embedding, index, retriever, DMO.',
      ask:`Before we build anything, what do you already picture when you hear "vector embedding"?`,
      body:`We'll define every term precisely on the next screens. Take a minute to appreciate the flow:<br><br><code>Raw content → Chunks → Vectors → Index → Retriever → Prompt → Answer</code><br><br>Each arrow is a step you'll master.`,
    },
    { t:'concept', eyebrow:'Chunks',
      title:'Chunks = bite-sized passages.',
      subtitle:'A PDF is too big to search. A sentence is too small. A chunk is just right.',
      ask:`Why can't we just index a whole 100-page PDF as one thing?`,
      body:`Embedding models have <b>token limits</b> (typically 512 tokens ≈ ~400 English words). A chunk is a passage — a paragraph, a section, a conversational turn — sized to fit that limit while preserving <i>one coherent idea</i>.<br><br>Think of it like a card in a library card catalog: each chunk is one findable unit that stands on its own.`,
    },
    { t:'concept', eyebrow:'Vectors & Embeddings',
      title:'A vector is a list of numbers that captures meaning.',
      subtitle:'"How do I sign in?" and "Login help" land near each other in vector space.',
      ask:`How can numbers capture meaning?`,
      body:`An <b>embedding model</b> (a neural network) reads a chunk of text and outputs a <b>vector</b> — an array of hundreds or thousands of floats. Similar meanings produce similar vectors. Search becomes math: find the vectors closest to the query's vector.<br><br>This is why <b>semantic search</b> works: it matches meaning, not just words.`,
    },
    { t:'concept', eyebrow:'Search Index',
      title:'The index stores chunks + their vectors, ready to search.',
      subtitle:'Two flavors: vector-only or hybrid (vector + keyword).',
      ask:`When would exact keyword matching still matter?`,
      body:`A <b>vector index</b> finds passages by meaning. A <b>hybrid index</b> combines vector similarity with keyword (lexical) matching — critical for product codes, part numbers, jargon like <code>LaserPrinter TX-400</code> where the exact string matters.<br><br>Data Cloud builds and manages both types for you.`,
    },
    { t:'concept', eyebrow:'Retriever',
      title:'The retriever is the front door.',
      subtitle:'It turns "user question" into "top-K matching chunks".',
      ask:`Why do we need a retriever if we already have an index?`,
      body:`A retriever wraps the index with query-time behavior: how many results to return, which fields to include, filters (only "published" articles, only recent tickets), and fusion tuning. It is the reusable, named object that <b>prompts</b> and <b>agents</b> call.<br><br>Index = library. Retriever = librarian.`,
    },
    { t:'concept', eyebrow:'DLO vs DMO',
      title:'Two layers: raw and modeled.',
      subtitle:'DLO = ingested-as-is. DMO = harmonized business object.',
      ask:`Why keep two copies of the same data — one raw, one modeled?`,
      body:`<b>Data Lake Object (DLO):</b> Raw data ingested from a source, as-is. Example: <code>Case_Home__dll</code>.<br><br><b>Data Model Object (DMO):</b> A harmonized, mapped, business-friendly object. Example: <code>Case DMO</code>. Multiple DLOs can map into one DMO (e.g., Cases from CRM + Zendesk → one Case DMO).<br><br>When you build a search index, you point at a <b>DMO</b> — clean, standardized data. The DLO is the plumbing layer beneath it.`,
    },
    { t:'concept', eyebrow:'The Four DMO Types You Meet',
      title:'Structured, Unstructured, Chunk, Index.',
      subtitle:'Each plays a specific role in the RAG pipeline.',
      ask:`How does a PDF end up as a queryable object?`,
      body:`When you ingest content, Data Cloud creates:<br><br>• <b>Structured DMO:</b> Regular business data (Cases, Accounts, Contacts).<br>• <b>Unstructured DMO (UDMO):</b> One record per raw file (PDF, DOCX). Has fields like <code>FilePath__c</code>, <code>Labels__c</code>, <code>URL__c</code>.<br>• <b>Chunk DMO (CDMO):</b> One record per parsed passage. <b>Semantic</b> DMO type, <b>Content</b> data category. Fields: <code>Chunk__c</code>, <code>ChunkSequenceNumber__c</code>, <code>Citation__c</code>, <code>SourceRecordId__c</code>.<br>• <b>Index DMO (IDMO):</b> One record per embedding. <b>Semantic</b> DMO type, <b>Vector Embedding</b> data category. Fields: <code>VectorEmbedding__c</code> (array of floats), plus reference to the Chunk DMO.<br><br>All four are queryable and joinable, just like Account or Contact.`,
    },
    { t:'concept', eyebrow:'UDLO → UDMO Relationship',
      title:'One UDMO can consolidate many UDLOs.',
      subtitle:'The relationship is 1:1 or N:1 — never 1:N.',
      ask:`If you have case recordings sitting in two AWS buckets and one Google Cloud bucket, do you need three separate UDMOs?`,
      body:`Data Cloud auto-maps fields between a UDLO and its UDMO because the schemas are <b>identical</b>. The relationship is:<br><br>• <b>1:1</b> — one UDLO → one UDMO, or<br>• <b>N:1</b> — many UDLOs → one UDMO.<br><br>Never 1:N. Each UDLO maps to <b>at most one</b> UDMO.<br><br><b>Example:</b> three UDLOs — <code>CaseRecordingsFromAWSBucket1</code>, <code>CaseRecordingsFromAWSBucket2</code>, <code>CaseRecordingsfromGCS</code> — all logically the same object, so they consolidate into ONE UDMO named <code>CaseRecordings</code>. The search index is then built on that one UDMO, giving the retriever a unified view across three physical storage locations.<br><br><b>Important:</b> Data Cloud does NOT import unstructured files. UDMOs <b>reference</b> them from the external blob store.`,
    },
    { t:'concept', eyebrow:'Knowledge Article Rich-Text Limit',
      title:'Knowledge custom rich-text fields hold up to 131 KB.',
      subtitle:'That is a lot of unstructured knowledge per article — index it all.',
      ask:`When you index a Knowledge Article Version, which fields carry the most retrievable meaning?`,
      body:`Knowledge Article Version fields worth indexing:<br><br>• <b>Name</b> — the article title (short but heavily weighted in ranking).<br>• <b>Description</b> — the summary (auto-mapped from Summary).<br>• <b>Custom rich-text fields</b> — up to <b>131 KB per field</b> of unstructured HTML content.<br><br>A single Knowledge article can therefore carry hundreds of pages of chunkable content across its rich-text fields. When you create the search index in Advanced Setup, click <b>Manage Fields</b> and index all of them — this is almost always the right choice for Knowledge sources.`,
    },
    { t:'concept', eyebrow:'Citations',
      title:'Every chunk knows where it came from.',
      subtitle:'The <code>Citation__c</code> field on the Chunk DMO is a JSON pointer to the exact source location.',
      ask:`If a chunk came from page 7 of a PDF, how would the UI show that?`,
      body:`Citations are stored as JSON in <code>Citation__c</code> on the Chunk DMO. The shape depends on file type:<br>• <b>PDF:</b> <code>{type: "pdf", page_number: 7}</code><br>• <b>Excel:</b> <code>{type: "xlsx", page_number: 1, page_name: "Sheet1"}</code><br>• <b>Audio/Video:</b> <code>{type: "mp4", start_time: 0.0, end_time: 10.4}</code><br><br>Agentforce agents surface these back to users as clickable citations — so trust is built in.`,
    },
    { t:'quiz', eyebrow:'Quick Check', prompt:'What is the difference between an index and a retriever?',
      scn:`Getting this distinction right unlocks everything that follows.`,
      options:[
        {label:'The index stores chunks + vectors; the retriever queries the index on behalf of prompts and agents', correct:true, fb:'Exactly. Index = storage. Retriever = query layer with filters, top-K, fusion tuning.'},
        {label:'They are the same thing with different names', correct:false, fb:'No. You can point many retrievers with different filters at the same index.'},
        {label:'The retriever creates chunks; the index displays them', correct:false, fb:'No. Chunks are created during indexing. The retriever only queries.'},
      ] },
  ]},

  /* ---------------- M3. END-TO-END JOURNEY ---------------- */
  { id:'journey', title:'The Full Journey', icon:'route', steps:[
    { t:'concept', eyebrow:'See The Whole Pipeline',
      title:'Offline preparation, then online usage.',
      subtitle:'Two phases, each with clear steps.',
      ask:`If you were building this from scratch, which phase would happen first: preparation or querying?`,
      body:`RAG splits cleanly into <b>Offline</b> and <b>Online</b> work.<br><br><b>Offline (done once, then on refresh):</b><br>1. Ingest raw content → Data Stream<br>2. Parse & preprocess → clean text<br>3. Chunk → passages<br>4. Vectorize → embeddings<br>5. Build search index → Chunk + Index DMOs<br>6. Wrap with a retriever<br><br><b>Online (every user query):</b><br>7. User asks a question<br>8. Retriever fetches top-K chunks<br>9. Prompt template augments with those chunks<br>10. LLM generates a grounded, cited answer`,
    },
    { t:'custom', eyebrow:'Interactive Diagram', icon:'workflow',
      title:'Trace a real question through the pipeline.',
      subtitle:'Click each stage to see what happens.',
      ask:`As the query moves right, what is being added at each hop?`,
      html:`
        <div class="card card--surface" style="padding:var(--space-4)">
          <div id="pipeline-stages" style="display:grid;grid-template-columns:repeat(5,1fr);gap:var(--space-2);margin-bottom:var(--space-4)">
            <button class="btn btn--secondary btn--sm" data-stage="0">1. Query</button>
            <button class="btn btn--secondary btn--sm" data-stage="1">2. Retriever</button>
            <button class="btn btn--secondary btn--sm" data-stage="2">3. Index</button>
            <button class="btn btn--secondary btn--sm" data-stage="3">4. Prompt</button>
            <button class="btn btn--secondary btn--sm" data-stage="4">5. LLM</button>
          </div>
          <div id="stage-detail" style="padding:var(--space-3);background:var(--color-bg-subtle);border-radius:var(--radius-md);min-height:120px">
            <p style="color:var(--color-text-muted)">Click a stage above to inspect it.</p>
          </div>
        </div>`,
      init:function(node){
        const stages = [
          { title:'User asks a question', body:`<b>Input:</b> "How do I reset my LaserPrinter TX-400?"<br><br>Plain natural language. No embeddings yet. No filters applied.` },
          { title:'Retriever receives it', body:`The retriever knows: <br>• which index to hit <br>• top-K results to return (e.g., 5)<br>• filters (e.g., only "published" articles, only in English)<br>• fusion behavior for hybrid` },
          { title:'Index performs the match', body:`Query is embedded into a vector. The index compares against millions of chunk vectors, plus keyword matching for hybrid.<br><br>Returns top-K chunks ranked by <code>hybrid_score__c</code>.` },
          { title:'Prompt template augments', body:`The prompt template stitches the retrieved chunks into the LLM prompt:<br><br><code>Use the following context:<br>{{retrieved_chunks}}<br><br>Question: {{user_question}}</code>` },
          { title:'LLM generates a grounded answer', body:`The LLM reads the retrieved passages and produces an answer grounded in them. It also emits <b>citations</b> pointing back to source chunk IDs so the UI can render "Source: Article 1234".` },
        ];
        const detail = node.querySelector('#stage-detail');
        node.querySelectorAll('[data-stage]').forEach(btn => {
          btn.addEventListener('click', () => {
            const i = parseInt(btn.getAttribute('data-stage'));
            const s = stages[i];
            detail.innerHTML = `<h4 style="margin:0 0 var(--space-2)">${s.title}</h4><p style="margin:0">${s.body}</p>`;
          });
        });
      },
      body:`The pipeline is <b>modular</b>. You can swap embedding models, change chunking strategies, adjust retriever filters — without rebuilding the whole thing.`,
    },
    { t:'quiz', eyebrow:'Quick Check', prompt:'Which of these steps happens ONLINE (at query time)?',
      scn:`Understanding offline vs. online is critical for cost planning.`,
      options:[
        {label:'The retriever fetches top-K chunks from the index', correct:true, fb:'Correct. Retrieval happens per query, in real time. Vectorization of source chunks is done once, offline.'},
        {label:'The PDFs are parsed into clean text', correct:false, fb:'No. Parsing is offline preparation. Once done, it is reused for every query.'},
        {label:'Chunks are vectorized', correct:false, fb:'No. Source chunks are vectorized offline. Only the incoming query is vectorized online.'},
      ] },
  ]},

  /* ================================================================
     PHASE 2 — QUICK WIN: See it work before diving deep
     ================================================================ */

  /* ---------------- M4. THE 10-MINUTE QUICK WIN ---------------- */
  { id:'quickwin', title:'10-Minute Quick Win', icon:'zap', steps:[
    { t:'concept', eyebrow:'Data Libraries — The Easy Button',
      title:'Skip all the plumbing. Get a grounded agent in minutes.',
      subtitle:'Agentforce Data Libraries automate the offline pipeline for common sources.',
      ask:`If someone hands you a stack of Knowledge articles and says "make my agent answer from these" — what's the fastest path?`,
      body:`An <b>Agentforce Data Library</b> is a preset that takes a source (Knowledge articles, uploaded files, or a custom retriever), and behind the scenes creates the data stream, search index, and retriever automatically. You wire it to an agent action and you're done.<br><br>You don't touch chunking, vectorizing, or DMO wiring. It just works.`,
    },
    { t:'concept', eyebrow:'Four Source Types',
      title:'What can a Data Library ingest?',
      subtitle:'Knowledge, Files, Web Search, or Custom Retriever.',
      ask:`Which source would you use if your product FAQs already live on your public marketing site?`,
      body:`<ul style="margin-left:var(--space-4); margin-top:var(--space-2)">
        <li><b>Knowledge Articles:</b> Salesforce Knowledge base — the fastest, cleanest option.</li>
        <li><b>Uploaded Files:</b> PDFs, DOCX, TXT you upload directly. Great for pilots.</li>
        <li><b>Web Search:</b> Grounds the agent on live web results. Zero ingestion — the search runs at query time. Best when authoritative content already exists on your public site or partner docs, and you don't want to duplicate it into Data Cloud.</li>
        <li><b>Custom Retriever:</b> Point at a retriever you built yourself over any Data Cloud data. Maximum flexibility.</li>
      </ul>`,
    },
    { t:'concept', eyebrow:'File Size Limits',
      title:'Know the ceilings before you upload.',
      subtitle:'Data Libraries enforce hard limits per file.',
      ask:`If a customer manual is 120 MB, will it upload?`,
      body:`Hard limits for Data Library uploads:<br>• <b>Text / HTML:</b> 4 MB per file<br>• <b>PDF:</b> 100 MB per file<br>• <b>Intelligent Context:</b> up to 5 documents per configuration<br><br>Anything over these limits is silently skipped. Compress or split large PDFs before upload.`,
    },
    { t:'concept', eyebrow:'Intelligent Context Toggle',
      title:'Advanced processing costs extra.',
      subtitle:'File libraries have a "Use Intelligent Context" toggle — locked once you save.',
      ask:`Why would you toggle Intelligent Context ON for a Data Library?`,
      body:`For <b>file-based</b> data libraries, you can enable <b>Advanced Processing via Intelligent Context</b>. This unlocks LLM-based parsing, image processing, and custom extraction prompts.<br><br><b>Trade-off:</b> consumes additional Intelligent Processing credits, and <b>cannot be changed after save</b> — you'd have to recreate the library. Decide upfront.`,
    },
    { t:'concept', eyebrow:'Custom Retriever Gotcha',
      title:'Dynamic filters are NOT supported here.',
      subtitle:'"Answer Questions with Knowledge" only honors static pre-filters.',
      ask:`If your agent needs to filter by "current user's region", can you do that in the retriever alone?`,
      body:`When you use a Custom Retriever with the standard <b>Answer Questions with Knowledge</b> action, only <b>static</b> pre-filters work. Dynamic filters (e.g., <code>Region = {{userContext}}</code>) are silently ignored.<br><br><b>Workarounds:</b><br>1. Create a separate data library per region/category<br>2. Wrap retrieval in a custom <b>Apex invocable action</b> that applies dynamic filters before calling the retriever`,
    },
    { t:'concept', eyebrow:'Sandbox Note',
      title:'Data Libraries and sandbox refresh.',
      subtitle:'Provisioning Data Cloud in a sandbox does not carry libraries over cleanly.',
      ask:`If you refresh a sandbox, why might your agent stop working?`,
      body:`After a Data Cloud sandbox provision, you often need to:<br>1. Check search indexes + retrievers came over<br>2. Turn Einstein ON in the sandbox<br>3. Verify data libraries exist under Agentforce Data Library<br>4. Re-upload files if missing<br>5. Refresh data streams to trigger reindexing<br>6. Deactivate + reactivate the retriever if stuck`,
    },
    { t:'concept', eyebrow:'Easy Setup vs Advanced',
      title:'Two paths to a search index.',
      subtitle:'Data Libraries use Easy Setup. Manual configs use Advanced Setup.',
      ask:`When does Easy Setup stop being enough?`,
      body:`<b>Easy Setup</b> (used by Data Libraries): automated hybrid index with defaults — passage extraction, E5-Large V2 embeddings, hybrid search. Great for pilots and standard Knowledge sources.<br><br><b>Advanced Setup:</b> full control over parser, chunking, embedding model, filter fields, ranking factors. Use when Easy Setup defaults don't fit (transcripts, tables, multilingual).`,
    },
    { t:'concept', eyebrow:'Content & Knowledge Harmonization',
      title:'One schema, multiple content types.',
      subtitle:'Knowledge articles + unstructured files → unified Content Viewer.',
      ask:`How do you present a mixed knowledge base to service agents in one view?`,
      body:`<b>Content and Knowledge Harmonization</b> transforms Knowledge articles and unstructured content into a single harmonized schema that feeds the <b>Content Viewer</b>. Agents (human or AI) see a unified view — same fields, same filters — regardless of whether the source is a Knowledge article, PDF, or DOCX.`,
    },
    { t:'concept', eyebrow:'Data Kits',
      title:'Package search indexes, retrievers, and schemas for reuse.',
      subtitle:'Share complete RAG configurations across orgs.',
      ask:`How would you deploy your production search index to a sibling org?`,
      body:`A <b>Data Kit</b> packages search indexes, document schemas, and retrievers into a portable bundle. Create in <b>Data Cloud Setup → Tools → Data Kits</b>, add your artifacts, publish, and include in a managed or unmanaged package via Package Manager.<br><br>Install in the target org. Everything wires up — no need to rebuild by hand.`,
    },
    { t:'custom', eyebrow:'Guided Walkthrough', icon:'play-circle',
      title:'Build your first grounded agent (conceptually).',
      subtitle:'Follow the four steps. No org needed — just visualize.',
      html:`
        <div class="card card--surface" style="padding:var(--space-4)">
          <ol id="qw-steps" style="margin:0;padding-left:var(--space-4);line-height:1.9">
            <li><b>Setup → Agentforce Data Library → New</b></li>
            <li>Select source: <i>Knowledge Articles</i></li>
            <li>Confirm defaults (chunking, index type) → <b>Create</b></li>
            <li>Open your Agent → add "Answer Questions with Knowledge" action → point at the library</li>
          </ol>
          <div style="margin-top:var(--space-3)">
            <button class="btn btn--primary btn--sm" id="qw-reveal"><i data-lucide="eye"></i> Reveal what Data Cloud did behind the scenes</button>
          </div>
          <div id="qw-behind" style="margin-top:var(--space-3);display:none">
            <ul class="fb-list">
              <li class="fb good"><i data-lucide="check"></i><span>Created a Data Stream from Knowledge</span></li>
              <li class="fb good"><i data-lucide="check"></i><span>Chose section-aware chunking (default for HTML)</span></li>
              <li class="fb good"><i data-lucide="check"></i><span>Built a hybrid search index (vector + keyword)</span></li>
              <li class="fb good"><i data-lucide="check"></i><span>Wrapped it with a default retriever (top-K = 5)</span></li>
              <li class="fb good"><i data-lucide="check"></i><span>Registered the retriever with the agent action</span></li>
            </ul>
          </div>
        </div>`,
      init:function(node){
        const reveal = node.querySelector('#qw-reveal');
        const behind = node.querySelector('#qw-behind');
        reveal.addEventListener('click', () => {
          behind.style.display = 'block';
          reveal.style.display = 'none';
          if(window.lucide) lucide.createIcons();
        });
      },
      body:`This is the fastest way to ship RAG. Later, when you need custom control (specific chunking, filters, enriched indexing), you'll drop down a level — but you never have to start from scratch.`,
    },
    { t:'quiz', eyebrow:'Quick Check', prompt:'Which of these does a Data Library NOT do automatically?',
      scn:`Knowing the automation boundary tells you when to reach for the manual path.',`,
      options:[
        {label:'Design custom chunking strategies for domain-specific content', correct:true, fb:'Correct. Data Libraries use sensible defaults. For custom chunking (e.g., conversation-based for transcripts), build a manual search index.'},
        {label:'Create a data stream from the source', correct:false, fb:'It does create the data stream automatically.'},
        {label:'Register a retriever with the agent action', correct:false, fb:'That is automated too.'},
      ] },
  ]},

  /* ================================================================
     PHASE 3 — IMPLEMENTATION: How each piece really works
     ================================================================ */

  /* ---------------- M5. PARSING & PREPROCESSING ---------------- */
  { id:'parsing', title:'Parsing & Preprocessing', icon:'file-search', steps:[
    { t:'concept', eyebrow:'Step 1 of the Pipeline',
      title:'Raw file → clean, structured text.',
      subtitle:'Parsing extracts text from PDFs, DOCX, HTML. Preprocessing cleans and normalizes it.',
      ask:`A PDF has text, images, tables, headers, footers. Which parts should end up in your search index?`,
      body:`Before you can chunk or vectorize, you need clean text. <b>Parsing</b> pulls readable content out of files. <b>Preprocessing</b> optionally cleans, deduplicates, and transforms it (e.g., strip nav menus, normalize whitespace).<br><br>Bad parsing = garbage chunks = broken retrieval. This step is the foundation.`,
    },
    { t:'concept', eyebrow:'Three Parsing Methods',
      title:'Default, LLM-based, and Docling.',
      subtitle:'Trade-offs: speed, cost, and fidelity.',
      ask:`If your PDFs are heavy with tables and diagrams, which parser would you pick?`,
      body:`<ul style="margin-left:var(--space-4); margin-top:var(--space-2)">
        <li><b>Default Parser:</b> Fast, cheap, works for clean text-based PDFs and HTML. Struggles with complex tables.</li>
        <li><b>LLM-Based Parser:</b> Uses an LLM to understand context. Higher fidelity, higher cost.</li>
        <li><b>Docling Parser:</b> Preserves tables (as structured markdown), image captions, layout. Best for visual/complex documents. Uses Intelligent Processing credits.</li>
      </ul>`,
    },
    { t:'concept', eyebrow:'When Preprocessing Matters',
      title:'Not every source is clean.',
      subtitle:'HTML pages often have nav, ads, footers you do not want indexed.',
      ask:`If you index a support forum HTML page as-is, what junk might end up in your chunks?`,
      body:`Preprocessing lets you strip repetitive boilerplate (nav bars, cookie banners), normalize whitespace, and even use an LLM to rewrite messy text into clean prose. Skip it when the source is already clean (Salesforce Knowledge). Reach for it when ingesting scraped or user-uploaded content.`,
    },
    { t:'concept', eyebrow:'Supported LLMs',
      title:'Five LLMs available for parsing and preprocessing.',
      subtitle:'Pick by cost, latency, and reasoning strength.',
      ask:`Which LLM would you pick for a nightly batch of dense legal contracts vs a real-time support flow?`,
      body:`Data Cloud supports these LLMs for LLM-based parsing and preprocessing:<br><br>• <b>GPT 4.o</b><br>• <b>GPT 5.4</b><br>• <b>Claude Opus 4.6</b> (deepest reasoning, most expensive)<br>• <b>Claude Sonnet 4.6</b> (balanced)<br>• <b>Gemini 3.0 Flash</b> (fastest, cheapest)<br><br>All are billed as Advanced Prompts. Choose based on document complexity and budget.`,
    },
    { t:'concept', eyebrow:'Mutual Exclusivity Rule',
      title:'You cannot combine LLM-based parsing AND LLM-based preprocessing.',
      subtitle:'One or the other. Not both.',
      ask:`Why does Data Cloud enforce this?`,
      body:`Both operations use an LLM to transform content. Running both would double LLM cost with diminishing return — each stage would re-process material the other already normalized.<br><br><b>Rule:</b> pick ONE of:<br>• LLM-based Parser<br>• LLM-based Visual Data Preprocessing<br><br>The UI grays out the second option once you select the first.`,
    },
    { t:'concept', eyebrow:'Docling Image Processing',
      title:'A separate toggle inside Docling.',
      subtitle:'Capture complex infographics, RACI charts, flowcharts as captioned text.',
      ask:`If your PDF has a flowchart with critical instructions, will Docling capture it by default?`,
      body:`Docling's default extracts tables and layout. To capture <b>images and complex infographics</b>, enable the <b>Image Processing</b> toggle. This uses an LLM to caption images with context ("Fig 3: Password reset flow showing 4 steps..."). It <b>filters out</b> irrelevant images (logos, decorative graphics) automatically.<br><br>Higher fidelity for visual documents. Higher Intelligent Processing credit consumption.`,
    },
    { t:'quiz', eyebrow:'Quick Check', prompt:'Your team is indexing product manuals with complex nested tables. Which parser fits best?',
      options:[
        {label:'Docling parser', correct:true, fb:'Correct. Docling preserves table structure as markdown, which downstream chunkers can respect.'},
        {label:'Default parser', correct:false, fb:'Default parsing typically flattens tables into hard-to-read text, destroying the structure.'},
        {label:'Skip parsing entirely', correct:false, fb:'You cannot skip parsing — chunks need text, not raw binary PDFs.'},
      ] },
  ]},

  /* ---------------- M6. CHUNKING DEEP DIVE ---------------- */
  { id:'chunking', title:'Chunking Deep Dive', icon:'slice', steps:[
    { t:'concept', eyebrow:'Step 2 of the Pipeline',
      title:'One chunk = one findable idea.',
      subtitle:'Chunk too small → no context. Chunk too big → embedding overflow, diluted meaning.',
      ask:`If a user asks "what's your refund policy?" would you rather retrieve one crisp paragraph or a whole 20-page policy doc?`,
      body:`Chunking is a Goldilocks problem. Aim for chunks that <b>stand alone</b> — a reader picking up just that chunk should be able to answer a related question.<br><br>Data Cloud picks a default strategy based on content type, but you can override.`,
    },
    { t:'concept', eyebrow:'Six Chunking Strategies',
      title:'Match strategy to content shape.',
      subtitle:'Section-aware, semantic-based, window-based, conversation-based, prepend field, code extension.',
      ask:`Which strategy would you use for call center transcripts?`,
      body:`<ul style="margin-left:var(--space-4); margin-top:var(--space-2)">
        <li><b>Section-Aware:</b> Uses headings (H1/H2/H3) as boundaries. Default for HTML and structured PDFs.</li>
        <li><b>Semantic-Based Passage Extraction:</b> Uses <em>semantic meaning</em> of HTML tags — headings (<code>&lt;h1&gt;-&lt;h2&gt;</code>), lists (<code>&lt;ul&gt;/&lt;ol&gt;</code>), and <code>&lt;strong&gt;</code> acting as a subheading — as logical passage boundaries. Best when your source HTML is well-tagged.</li>
        <li><b>Window-Based Passage Extraction:</b> Uses <em>block-level</em> elements — <code>&lt;div&gt;</code>, <code>&lt;p&gt;</code>, or raw text separated by line breaks. If a paragraph has no HTML at all, the extractor falls back to <b>sentence-level</b> chunking. Best when structure is missing or inconsistent (scraped content, plain-text pastes).</li>
        <li><b>Conversation-Based:</b> Segments by speaker turn. Ideal for transcripts and chat logs.</li>
        <li><b>Prepend Field:</b> Adds metadata (title, product name) to every chunk for context.</li>
        <li><b>Code Extension:</b> Bring-your-own chunking logic for exotic formats.</li>
      </ul>`,
    },
    { t:'concept', eyebrow:'Semantic vs Window — how to choose',
      title:'Structure quality drives the choice.',
      subtitle:'Both split by HTML — one respects meaning, the other respects layout.',
      ask:`If your ingested HTML has clean <code>&lt;h1&gt;/&lt;h2&gt;/&lt;h3&gt;</code> hierarchy AND messy pages with no headings — which one strategy handles both?`,
      body:`Neither. They solve different problems:<br><br>• <b>Semantic-based</b> assumes the writer used HTML tags <em>meaningfully</em>. A <code>&lt;strong&gt;</code> mid-paragraph is treated as a real subheading. Great for Knowledge articles and well-authored docs.<br>• <b>Window-based</b> is agnostic to meaning — it just splits on block containers. If HTML tagging is unreliable (scraped forum content, mixed sources), window-based produces more consistent chunks. When paragraphs have no HTML at all, it silently falls back to sentence boundaries so nothing gets lost.<br><br><b>Rule of thumb:</b> if you'd trust the source's tags in a screen reader, use semantic-based. Otherwise use window-based.`,
    },
    { t:'concept', eyebrow:'Tokens and Language',
      title:'512 tokens is the default. Language matters.',
      subtitle:'One English word ≈ one token. Japanese/Chinese characters can pack many tokens per phrase.',
      ask:`Why might a 512-token limit be too permissive for Chinese text?`,
      body:`For Latin-based languages, a word ≈ one token. For CJK languages, character-to-token ratios are higher and less predictable — 512 tokens of Japanese may only capture a couple of sentences. Lower the max token setting (e.g., 300–400) to keep all content indexed.`,
    },
    { t:'concept', eyebrow:'Overlap and Prepend',
      title:'Two knobs to fight context loss.',
      subtitle:'Overlap: chunks share edges. Prepend: chunks inherit parent metadata.',
      ask:`A chunk about "returns policy" doesn't mention the product it applies to. How do you fix that?`,
      body:`<b>Overlap tokens</b> make adjacent chunks share a bit of text — this preserves context across boundaries. Only applies to section-aware chunking when a section produces multiple chunks.<br><br><b>Prepend fields</b> stamp each chunk with metadata like <code>Product: LaserPrinter TX-400</code> or <code>Article Title: Returns Policy</code>. Note: prepend field content over <b>512 tokens is silently skipped</b> — keep prepends short.`,
    },
    { t:'concept', eyebrow:'Key Numbers to Remember',
      title:'Chunk limits cheat sheet.',
      subtitle:'Memorize these — they show up in every real project.',
      ask:`Which of these numbers is easy to overlook and costly to get wrong?`,
      body:`<ul style="margin-left:var(--space-4); margin-top:var(--space-2)">
        <li><b>512 tokens</b> — default max per chunk</li>
        <li><b>~1 word = 1 token</b> for Latin-based languages</li>
        <li><b>300–400 tokens</b> — recommended max for CJK (Japanese, Chinese, Korean) — punctuation-to-token ratio is much higher</li>
        <li><b>512 tokens</b> — prepend field limit (silently skipped if exceeded)</li>
        <li><b>Overlap tokens</b> — only applies to section-aware chunking</li>
      </ul>`,
    },
    { t:'quiz', eyebrow:'Quick Check', prompt:'You are indexing sales call transcripts. Which chunking strategy fits best?',
      options:[
        {label:'Conversation-based (segments by speaker turn)', correct:true, fb:'Correct. Speaker-turn boundaries preserve conversational context better than fixed-length chunks.'},
        {label:'Section-aware (uses HTML headings)', correct:false, fb:'Transcripts rarely have H1/H2 headings, so this strategy has nothing to chunk on.'},
        {label:'Prepend field (adds metadata)', correct:false, fb:'Prepend is a modifier, not a standalone strategy — you\'d layer it on top of another one.'},
      ] },
  ]},

  /* ---------------- M7. VECTOR SEARCH ---------------- */
  { id:'vector', title:'Vector Search', icon:'target', steps:[
    { t:'concept', eyebrow:'Step 3 of the Pipeline',
      title:'Vectorize once. Query forever.',
      subtitle:'Each chunk becomes a point in high-dimensional space.',
      ask:`If "sign in" and "log in" have almost identical meaning, where do their vectors sit in space?`,
      body:`An <b>embedding model</b> reads each chunk and produces a vector — typically 384 to 3072 floats long. Similar meanings produce vectors that are close together (small angle between them).<br><br>At query time, the user's question is embedded the same way, then the index finds the nearest chunk vectors. That's semantic search.`,
    },
    { t:'concept', eyebrow:'Embedding Models',
      title:'Three built-in models. Pick by language and length.',
      subtitle:'Dimensions and max sequence length differ.',
      ask:`If your customers write in French, Japanese, and Portuguese, which model should you pick?`,
      body:`Data Cloud ships three embedding models:<br><br>• <b>e5-large-v2</b> — 1024 dims, 512-token context. Strong English retrieval.<br>• <b>multilingual-e5-large</b> — 1024 dims, 512-token context. Handles 100+ languages.<br>• <b>SFR-v2-small</b> (beta) — 1024 dims, <b>8,000-token context</b>. For long-form content and image embeddings.<br><br>All chunks in one index share one model — choose before indexing. Changing the model requires a full rebuild.`,
    },
    { t:'concept', eyebrow:'SFR-v2-small — Regulatory Note',
      title:'Long-context model with a compliance caveat.',
      subtitle:'90-day removal notice clause.',
      ask:`Why would Salesforce give a 90-day notice for a specific embedding model?`,
      body:`SFR-v2-small has a stated policy: if Salesforce must remove the model due to regulatory changes affecting LLMs developed by Chinese entities, customers receive <b>90 days notice</b> before removal.<br><br>Plan accordingly if using it in production. Avoid for compliance-critical, long-lived pipelines unless you have a fallback embedding strategy.`,
    },
    { t:'concept', eyebrow:'Filter Limits',
      title:'Up to 10 filter fields, up to 10 IN options.',
      subtitle:'Hard limits enforced at index creation.',
      ask:`If you need to filter chunks by 15 different fields, what do you do?`,
      body:`Two limits to memorize:<br>• <b>10 filter fields max</b> per index (from source object or related objects with 1:1 or N:1 cardinality)<br>• <b>10 options max</b> in an <code>IN</code> or <code>NOT IN</code> clause<br><br>If you need more filters, split into multiple indexes or push the filter into the source data via a mapped DMO.`,
    },
    { t:'concept', eyebrow:'Query API',
      title:'You can call vector search directly.',
      subtitle:'Useful for debugging and custom apps.',
      ask:`Why would a developer want to bypass the retriever and hit the raw index?`,
      body:`The Data Cloud Query API supports <code>vector_search(query, index, top_k)</code>. You can:<br>• Inspect what chunks come back for a given query.<br>• Apply custom SQL filters (only recent, only English, only my region).<br>• Debug why an agent is returning wrong results.<br><br>Every retriever runs the same primitive under the hood.`,
    },
    { t:'concept', eyebrow:'Pre-Filtering',
      title:'Filter before you rank.',
      subtitle:'Cut the search space with SQL-style predicates.',
      ask:`If your index has 10 million chunks but the user only cares about "published" ones in English, when should you filter?`,
      body:`Pre-filtering applies predicates <b>before</b> the vector similarity search. This is faster and more accurate than post-filtering. Common filters:<br>• <code>Language__c = 'en'</code><br>• <code>PublishStatus__c = 'Published'</code><br>• <code>UpdatedAt__c &gt; '2026-01-01'</code>`,
    },
    { t:'quiz', eyebrow:'Quick Check', prompt:'A user searches for "return an item". Vector search returns a chunk that says "eligible for refund within 30 days". Why?',
      options:[
        {label:'The embedding model recognizes that "return" and "refund" have similar meaning', correct:true, fb:'Correct. Vector search matches meaning, not keywords. Both concepts land near each other in vector space.'},
        {label:'The chunk contains the exact word "return"', correct:false, fb:'No. Pure vector search does not rely on exact keyword matches — that\'s hybrid search.'},
        {label:'Data Cloud re-writes queries with synonyms', correct:false, fb:'No. The embedding model captures semantic similarity directly; no rewriting is needed.'},
      ] },
  ]},

  /* ---------------- M8. HYBRID SEARCH & FUSION ---------------- */
  { id:'hybrid', title:'Hybrid Search', icon:'combine', steps:[
    { t:'concept', eyebrow:'Vector + Keyword = Hybrid',
      title:'Some queries need exact matches.',
      subtitle:'Product codes, error codes, part numbers — literal strings that vectors dilute.',
      ask:`Would pure vector search reliably match a query like "TX-400 error E-27"?`,
      body:`Vector search is great at meaning but weak at literal identifiers. <b>Hybrid search</b> runs both a vector search and a keyword (BM25-style) search, then <b>fuses</b> the two rankings into one final list.<br><br>Result: semantic reach <i>plus</i> literal precision.`,
    },
    { t:'concept', eyebrow:'Fusion Ranking Models',
      title:'Three ways to combine two rankings.',
      subtitle:'RRF, LFR, DFR — pick by need.',
      ask:`If a chunk ranks #2 in vector and #5 in keyword, what should its final rank be?`,
      body:`<ul style="margin-left:var(--space-4); margin-top:var(--space-2)">
        <li><b>RRF (Reciprocal Rank Fusion):</b> Default. Simple, robust, no tuning. Sums <code>1/(k + rank)</code> across both lists.</li>
        <li><b>LFR (Linear Fusion Ranking):</b> Customizable weights. Boost keyword or vector to taste.</li>
        <li><b>DFR (Deep Fusion Ranking):</b> A neural model that learns fusion. Highest accuracy, higher compute cost.</li>
      </ul>The final score lives in <code>hybrid_score__c</code>.`,
    },
    { t:'concept', eyebrow:'Ranking Factors',
      title:'Two named factors, up to 2 per index.',
      subtitle:'RECENCY (LastModifiedDate) and POPULARITY (ViewCount).',
      ask:`Your user asks about "release notes". Should a doc from 2019 outrank one from last week?`,
      body:`Hybrid indexes support up to <b>2 ranking factors</b>:<br><br>• <b>RECENCY</b> — bound to a date/datetime field (typically <code>LastModifiedDate</code>). Newer chunks get a boost.<br>• <b>POPULARITY</b> — bound to a numeric field (typically <code>ViewCount</code>). Popular chunks score higher.<br><br>Both are configured at index creation. Vector-only indexes do not support ranking factors — only hybrid.`,
    },
    { t:'concept', eyebrow:'Autodrop — Recommended Defaults',
      title:'Specific num_drops values matter.',
      subtitle:'Keyword: 2. Vector: 5. Avoid autodrop_hybrid.',
      ask:`Why would keyword and vector autodrop have different default values?`,
      body:`<b>Autodrop</b> removes the low-relevance tail before the LLM sees results. Recommended values:<br><br>• <code>autodrop_keyword: {"num_drops": 2}</code> (or 5 for less aggressive)<br>• <code>autodrop_vector: {"num_drops": 5}</code><br>• <b>Avoid <code>autodrop_hybrid</code></b> — unpredictable behavior<br><br>Increase <code>num_drops</code> to be <b>less aggressive</b> (retain more results). Decrease to be more aggressive. If the value exceeds actual drops, no truncation is applied.`,
    },
    { t:'concept', eyebrow:'Determinism Caveat',
      title:'A chunk can rank high with keyword_score = 0.',
      subtitle:'If its vector score is very high relative to peers, keyword absence does not disqualify it.',
      ask:`If keyword score is zero, should a chunk still surface in top results?`,
      body:`The fusion ranker was trained on internal Salesforce benchmarks (Einstein Search + RAG annotations, evaluated on precision, robustness, and sensitivity). A chunk with <code>keyword_score__c = 0</code> can still rank high overall — as long as its <code>vector_score__c</code> is dominant among candidates.<br><br>Don't be surprised when keyword-empty chunks appear in the top-K.`,
    },
    { t:'quiz', eyebrow:'Quick Check', prompt:'When would you prefer LFR over RRF?',
      options:[
        {label:'When you need to weight keyword matches more heavily than vector matches', correct:true, fb:'Correct. LFR exposes weights you can tune. RRF is fixed. DFR learns but is heavier.'},
        {label:'When you have no data to tune with — you just want defaults', correct:false, fb:'That describes RRF, not LFR.'},
        {label:'When you need the highest possible accuracy at any cost', correct:false, fb:'That describes DFR, not LFR.'},
      ] },
  ]},

  /* ---------------- M9. ENRICHED INDEXING ---------------- */
  { id:'enriched', title:'Enriched Indexing', icon:'sparkles', steps:[
    { t:'concept', eyebrow:'Make Chunks Smarter',
      title:'One chunk → three chunks (plain, metadata, question).',
      subtitle:'Use an LLM to pre-extract Q&A hooks and metadata.',
      ask:`If your users ask questions like "how do I do X?" but your chunks are written as declarative prose ("X is done by..."), how do you improve match rates?`,
      body:`<b>Enriched indexing</b> uses an LLM at index time to derive three chunks from every original chunk:<br><br>1. <b>Plain chunk:</b> Original text.<br>2. <b>Metadata chunk:</b> Keywords, entities, topics, summary.<br>3. <b>Question chunk:</b> Sample questions this chunk answers.<br><br>The question chunk is the killer feature: user questions now match chunks that literally look like questions.`,
    },
    { t:'concept', eyebrow:'When To Use It',
      title:'High-value for Q&A. Overkill for keyword lookup.',
      subtitle:'You pay 3x storage and LLM cost. Make sure the win is worth it.',
      ask:`Would you enrich a product catalog with SKU numbers? Or a knowledge base of how-to articles?`,
      body:`<b>Enrich when:</b><br>• Users ask natural-language questions.<br>• Baseline retrieval is weak.<br>• Content is dense prose that doesn't self-describe well.<br><br><b>Skip enrichment when:</b><br>• Content is already Q&A formatted.<br>• Users search by exact identifiers (SKUs, part numbers).<br>• Cost matters more than that last 10% accuracy.`,
    },
    { t:'concept', eyebrow:'Cost Math',
      title:'3x chunks + LLM processing per chunk.',
      subtitle:'Estimate before enabling.',
      ask:`If your baseline index has 100K chunks, how many chunks does enriched indexing create?`,
      body:`Enriched indexing produces roughly <b>3x chunks</b> (plain + metadata + question). Plus, you pay for LLM inference to generate each metadata/question chunk. On refresh, this cost repeats for any changed content.<br><br>Budget carefully — but the retrieval quality lift is often 15–30% on Q&A workloads.`,
    },
    { t:'concept', eyebrow:'The Exact Numbers',
      title:'5 MB PDF → 240 Flex Credits worked example.',
      subtitle:'Enrichment processes 4 chunks per LLM request.',
      ask:`Can you estimate this before enabling it?`,
      body:`Concrete math for a moderate-density 5 MB PDF:<br><br>• 5 MB × <b>16 chunks/MB</b> = <b>80 chunks</b><br>• Enrichment batches <b>4 chunks per LLM request</b> → <b>20 requests</b><br>• Each request: 2,100 (instructions) + 2,048 (4×512 chunk tokens) + 1,500 (output) = <b>5,648 tokens</b><br>• Billing: <b>2,000 tokens = 1 unit</b> (rounds up) → 3 units/request<br>• <b>Standard Prompt: 4 Flex Credits per unit</b> → 12 credits/request<br>• Total: 20 × 12 = <b>240 Flex Credits</b><br><br>Dense content (121 chunks/MB) scales up: same 5 MB → 605 chunks → 1,824 credits.`,
    },
    { t:'concept', eyebrow:'De-Duplication at Retrieval',
      title:'You will not see the same content 3 times.',
      subtitle:'Multiple enriched chunks map to one plain chunk — retrieval deduplicates.',
      ask:`If plain, metadata, and question chunks all point to the same source passage, will the LLM see it three times?`,
      body:`No. At retrieval time, when multiple enriched chunks resolve to the same plain source chunk, Data Cloud <b>retains only one instance</b> of the plain chunk in the result set. The metadata and question chunks helped it get retrieved — but the LLM sees the original text once.<br><br>This keeps prompts focused and avoids paying LLM tokens for triplicated content.`,
    },
    { t:'quiz', eyebrow:'Quick Check', prompt:'A team enables enriched indexing on their SKU-to-price catalog. What likely goes wrong?',
      options:[
        {label:'They pay 3x storage and LLM cost for negligible retrieval improvement — users search by exact SKU, which vector/keyword already handles', correct:true, fb:'Correct. Enrichment shines on natural-language Q&A, not identifier lookup.'},
        {label:'The LLM refuses to generate metadata for structured data', correct:false, fb:'The LLM will happily generate metadata — it just won\'t help retrieval much for this content.'},
        {label:'Enriched indexing breaks hybrid search', correct:false, fb:'No. Enrichment composes cleanly with hybrid search.'},
      ] },
  ]},

  /* ---------------- M10. RETRIEVERS ---------------- */
  { id:'retrievers', title:'Retrievers', icon:'link', steps:[
    { t:'concept', eyebrow:'The Bridge',
      title:'Retrievers connect indexes to prompts and agents.',
      subtitle:'One index → many retrievers with different filters, K values, and defaults.',
      ask:`Why not just let the prompt template call the index directly?`,
      body:`Retrievers give you:<br>• <b>Named, reusable</b> query behavior<br>• <b>Filters</b> baked in (only published, only English)<br>• <b>Top-K</b> control (5, 10, 20)<br>• <b>Field selection</b> (which chunk fields to return)<br>• A stable interface even if you rebuild the underlying index<br><br>Prompt templates and agent actions call retrievers by name, not indexes directly.`,
    },
    { t:'concept', eyebrow:'Retriever Playground',
      title:'Test your retriever before wiring an agent.',
      subtitle:'Type a query, see what chunks come back.',
      ask:`If your agent gives wrong answers, is the retriever finding the right chunks?`,
      body:`The <b>Retriever Playground</b> in Setup lets you type test queries and inspect the ranked results — chunk text, scores, source records. This is the single most important tool for debugging RAG. If the right chunk isn't in the top-K here, no LLM cleverness will save you.`,
    },
    { t:'concept', eyebrow:'Agentforce Testing Center',
      title:'Auto-generate test cases from your knowledge.',
      subtitle:'Batch-run realistic queries against your agent.',
      ask:`How would you regression-test an agent after tuning your search index?`,
      body:`<b>Agentforce Testing Center</b> lets you generate test cases directly from your knowledge sources — questions the agent should be able to answer. You can run these in batches, track pass/fail over time, and catch regressions from tuning changes.<br><br>Pair it with the Retriever Playground for a full quality loop: tune → test → measure → repeat.`,
    },
    { t:'concept', eyebrow:'Knowledge / RAG Quality Metrics',
      title:'Three scores tell you where retrieval breaks.',
      subtitle:'Context Precision, Faithfulness, Answer Relevance.',
      ask:`If your agent hallucinates, which metric drops?`,
      body:`Data Cloud exposes three RAG quality metrics:<br><br>• <b>Context Precision</b> — of the chunks retrieved, how many were actually relevant?<br>• <b>Faithfulness</b> — did the LLM stick to the retrieved context, or invent facts?<br>• <b>Answer Relevance</b> — did the answer actually address the user's question?<br><br>Low Faithfulness = hallucination. Low Context Precision = retrieval problem. Low Answer Relevance = prompt template problem.`,
    },
    { t:'concept', eyebrow:'Enhanced Event Logs',
      title:'See every step of the agent reasoning.',
      subtitle:'Turn on when debugging tricky conversations.',
      ask:`Where do you look when the agent's behavior seems random?`,
      body:`<b>Enhanced Event Logs</b> capture the full conversation trace: which subagent Atlas routed to, which action was invoked, what the retriever returned, what the prompt template rendered, what the LLM produced. Off by default (to save space). Turn on when you need to debug why an agent made a specific choice.`,
    },
    { t:'concept', eyebrow:'Field Selection',
      title:'Return only what the prompt needs.',
      subtitle:'Less noise = better LLM answers, lower cost.',
      ask:`If your Chunk DMO has 20 fields but the prompt only uses "Title" and "Body", what should the retriever return?`,
      body:`Configure the retriever to return only the fields your prompt uses. Sending 20 fields when 2 suffice:<br>• Bloats prompt tokens (higher cost)<br>• Distracts the LLM<br>• Slows retrieval<br><br>Field selection is one of the easiest wins in optimization.`,
    },
    { t:'quiz', eyebrow:'Quick Check', prompt:'You have one search index but need two behaviors: one for internal agents (no filters) and one for customer-facing agents (only published, only English). What do you do?',
      options:[
        {label:'Create two retrievers on the same index, each with its own filters', correct:true, fb:'Correct. Retrievers decouple query behavior from storage. Reuse the index; specialize the retriever.'},
        {label:'Build two search indexes', correct:false, fb:'Wasteful. The chunks and vectors are the same — only query behavior differs.'},
        {label:'Filter inside the prompt template', correct:false, fb:'Filtering post-retrieval defeats the purpose. Do it at retrieval time via the retriever.'},
      ] },
  ]},

  /* ================================================================
     PHASE 4 — SPECIALIZED TOOLS: Beyond core RAG
     ================================================================ */

  /* ---------------- M11. DOCUMENT AI ---------------- */
  { id:'docai', title:'Document AI', icon:'file-text', steps:[
    { t:'concept', eyebrow:'A Different Problem',
      title:'Extract structured fields, not passages.',
      subtitle:'When you need "InvoiceNumber = 12345" as a record, not a searchable chunk.',
      ask:`Would you use RAG to extract the total amount from 10,000 invoices, or would that be overkill?`,
      body:`RAG retrieves passages for an LLM to reason over. <b>Document AI</b> does something different: it extracts <b>structured fields</b> from documents (invoices, contracts, forms, lab reports, resumes) into DLOs you can query, report on, and automate against.<br><br>Both use LLMs. Different jobs. Different outputs.`,
    },
    { t:'concept', eyebrow:'Prerequisites',
      title:'Before you can even see the menu.',
      subtitle:'Doc AI has hard licensing and enablement gates.',
      ask:`Why might your Setup search for "Document AI" return zero results?`,
      body:`Requirements to use Document AI in Data 360:<br><br>• <b>Data 360 license</b> — <b>NOT</b> available on Customer Data Platform licenses. Full stop.<br>• <b>Turn on Einstein Generative AI</b> — Setup → Einstein Setup → Enable.<br>• <b>Enable Agentforce</b> in your org.<br>• Permission set: <b>Data Cloud Architect</b><br><br>If any of these are missing, the Document AI menu never appears.`,
    },
    { t:'concept', eyebrow:'Supported Files',
      title:'Narrower than search indexes. Know this.',
      subtitle:'Doc AI accepts fewer formats than the rest of Process Content.',
      ask:`Would a .docx contract work with Document AI?`,
      body:`Document AI supports <b>only 3 formats</b>:<br><br>• <b>PDF</b><br>• <b>PNG</b><br>• <b>JPEG</b><br><br>No .docx, .pptx, .txt, or .html. If your source is Word or PowerPoint, convert to PDF first — or use search indexes / Intelligent Context instead. See "Data Cloud Limits and Guidelines" for size caps per format.`,
    },
    { t:'concept', eyebrow:'Supported LLMs',
      title:'You pick the model per configuration.',
      subtitle:'Model choice affects cost tier (basic vs standard prompt) and Government Cloud availability.',
      ask:`Which model does Government Cloud force you into?`,
      body:`Document AI supports these models:<br><br>• <b>OpenAI</b> — GPT 5.4 (OpenAI GPT-4o)<br>• <b>Vertex AI (Google)</b> — Gemini 2.5 Flash, Gemini 3 Flash<br>• <b>Anthropic</b> — Claude Sonnet 4.6<br><br><b>Government Cloud</b>: only GPT-4o hosted in Microsoft Azure. No other model is available.<br><br>Each LLM gateway call is billed as a <b>basic or standard prompt</b> depending on the chosen model.`,
    },
    { t:'concept', eyebrow:'Three Creation Modes',
      title:'Not just "auto vs manual".',
      subtitle:'You can also build a schema WITHOUT a source object — for programmatic API workflows.',
      ask:`If you never want to store the extracted output in a DLO, which mode fits?`,
      body:`Three ways to create a Doc AI configuration:<br><br>1. <b>From a Source Object — Auto-extraction:</b> Point at a UDMO of sample docs. LLM infers fields, tables, columns automatically. Fast start.<br>2. <b>From a Source Object — Manual schema:</b> Point at a UDMO but define every field, table, column yourself. Predictable, auditable, best for high-stakes contracts.<br>3. <b>Without a Source Object:</b> Define a schema-only config for programmatic API use. <b>No output DLO is created</b> — Data Cloud doesn't store the extracted data. Use this when your Apex/Flow will call the API and handle results directly.`,
    },
    { t:'concept', eyebrow:'Real-Time vs Batch',
      title:'The real distinction is whether a UDMO is required.',
      subtitle:'It is not just "speed" — it is where the source files live.',
      ask:`If your Apex code has a PDF in a Blob and needs fields extracted right now, do you need a UDMO?`,
      body:`Two execution modes with different plumbing:<br><br>• <b>Real-time (Transactional) Mode</b> — Invoke Doc AI APIs directly for docs already in Salesforce or sent at run time. <b>No UDMO required.</b> Low latency, per-request.<br>• <b>Batch Mode</b> — For processing large volumes of docs from external sources. You <b>must</b> create a UDMO that references the files (via Data Cloud connectors). Extracted data lands in DLOs, available for search index processing and retrieval from Flow / Apex / agent actions.`,
    },
    { t:'concept', eyebrow:'Tables Are First-Class',
      title:'Line items, payment breakdowns, term tables.',
      subtitle:'Table rows become child records linked to the parent document DLO.',
      ask:`If an invoice has 15 line items, how should they be stored?`,
      body:`Doc AI extracts tables as related records:<br><br>• One <b>Invoice</b> record with header fields (VendorName, Total, Date)<br>• Many <b>InvoiceLineItem</b> child records (ItemID, Description, Quantity, UnitPrice, LineTotal)<br><br>This makes downstream automation (Flow loops, Apex, reports, Einstein Analytics) trivial. You can add optional <b>prompts per field, per table, or per schema</b> to guide extraction — e.g. "ignore appendix pages", "primary extraction language is English", "extract Item ID as string even if numeric".`,
    },
    { t:'concept', eyebrow:'Draft → Test → Publish → Rebuild',
      title:'Configurations have a lifecycle. Learn the four verbs.',
      subtitle:'Draft state lets you iterate over multiple sessions before activating.',
      ask:`Why not publish immediately after auto-extraction generates a schema?`,
      body:`Every Doc AI configuration moves through states:<br><br>• <b>Draft</b> — Save partial work. Refine over multiple sessions. Click <b>Test</b> to verify extraction against sample files. Iterate. Nothing is metered yet.<br>• <b>Activated</b> (via <b>Publish</b>) — Configuration goes live. Now it processes documents and consumes credits.<br>• <b>Rebuild</b> — If a published config starts failing (schema drift, new document variants), trigger Rebuild. Last Run Status flips back to Ready when done.<br>• <b>Delete</b> — Removes the configuration.<br><br>The details page shows Draft/Activated state, Runtime status, Last Run Status, source, output DLO.`,
    },
    { t:'concept', eyebrow:'Ship Across Orgs',
      title:'Export as JSON. Package in Data Kits.',
      subtitle:'Two portability paths — you rarely rebuild a schema by hand in a second org.',
      ask:`You spent 3 hours perfecting a Lab Report schema in sandbox. How do you get it into production?`,
      body:`Two ways to move a Doc AI configuration:<br><br>• <b>Export JSON</b> — From the configuration list, choose <b>Export JSON</b>. Downloads a JSON file. In the target org, use <b>Import from JSON</b> when creating a config without a source object.<br>• <b>Data Kits</b> — Data Cloud Setup → Tools → Data Kits → New. Under "Document Schemas", add your configs. Save + Publish. Ship the data kit via <b>Package Manager</b> like any managed package.<br><br>Data Kits are how enterprises deploy Doc AI to multiple business units without hand-rebuilding schemas.`,
    },
    { t:'concept', eyebrow:'Connect API',
      title:'You do not have to use the UI.',
      subtitle:'Full CRUD on Doc AI configurations via the Data Cloud Connect API.',
      ask:`Could you script the creation of 20 Doc AI configs from a CI/CD pipeline?`,
      body:`The <b>Data Cloud Connect API</b> exposes Doc AI configuration creation, updates, deletion, and export. See the Connect API reference.<br><br>Use it for:<br>• CI/CD pipelines that provision configs per environment<br>• Bulk migrations across orgs<br>• Programmatic real-time extraction (bypass UDMO entirely)`,
    },
    { t:'concept', eyebrow:'Cost Trap',
      title:'Every re-processing is a new charge.',
      subtitle:'This is not obvious and it is expensive.',
      ask:`You published a config, then noticed a field is misnamed. What is the cheap next step?`,
      body:`Doc AI billing rules that bite:<br><br>• <b>The meter runs every time a file is processed.</b> If the <i>same document</i> runs again (after a config change, Rebuild, or re-ingest), it counts as <b>separate usage</b>.<br>• LLM gateway calls are billed as <b>basic</b> or <b>standard prompts</b> depending on the model chosen — Advanced Prompt models cost more per call.<br>• Data Services "Intelligent Processing" and Flex Credits "Data 360 Intelligent Processing" both apply.<br><br><b>Rule:</b> Batch all schema changes together, test on a small sample, then publish once. Never publish → notice bug → republish → notice bug — you pay every round.`,
    },
    { t:'concept', eyebrow:'Example Use Cases',
      title:'Not every cloud, but many. Here are the documented ones.',
      subtitle:'These are the scenarios Salesforce ships as canonical.',
      ask:`Which of these use cases most resembles yours?`,
      body:`Documented Doc AI use cases by cloud:<br><br>• <b>Sales Cloud</b> — Ingest contracts and link to customer profiles. Ingest invoices and compare to loan applications.<br>• <b>Service Cloud</b> — Ingest guest survey data. Auto-create customer records + follow-ups.<br>• <b>Employee Service</b> — Ingest tax return documents, link to employee records.<br>• <b>Health Cloud</b> — Extract data from patient lab reports (handwritten or system-generated).<br><br>Sample JSON schemas for <b>Lab Report</b>, <b>Invoice</b>, and <b>Resume</b> ship in Salesforce docs — copy and adapt them (see the Level 2 Hands-On Guide for the full schemas).`,
    },
    { t:'quiz', eyebrow:'Scenario Quiz', prompt:'You have 50,000 vendor invoices in an S3 bucket. Users need to search "which invoices from Acme exceed $10K in 2026?" and build reports. What is the right approach?',
      options:[
        {label:'Batch Mode Doc AI: connect S3 as a UDMO, define an Invoice schema (VendorName, Total, InvoiceDate as typed fields, LineItems as child table), publish, then query the resulting DLO with SQL/reports', correct:true, fb:'Correct. Typed fields + reporting + aggregation = Doc AI Batch. Search indexes cannot do numeric aggregation like ">$10K".'},
        {label:'Build a hybrid search index over the invoices and query it', correct:false, fb:'Search indexes return passages, not typed numeric fields. You cannot aggregate "sum > $10K" over passages.'},
        {label:'Use Intelligent Context to prototype extraction prompts and publish that as a search index', correct:false, fb:'IC publishes to a search index — still passages, not structured records. Wrong output shape.'},
      ] },
    { t:'quiz', eyebrow:'Format Quiz', prompt:'A user hands you a .docx contract and asks Doc AI to extract signatory names. What do you tell them?',
      options:[
        {label:'Doc AI only supports PDF, PNG, and JPEG — convert the .docx to PDF first', correct:true, fb:'Correct. .docx is not in the supported list. Convert to PDF and it works.'},
        {label:'It works — .docx is a supported format', correct:false, fb:'It is not. Only PDF, PNG, JPEG.'},
        {label:'Upload it to Intelligent Context first, then export to Doc AI', correct:false, fb:'IC and Doc AI are separate products. IC does not export to Doc AI.'},
      ] },
  ]},

  /* ---------------- M12. INTELLIGENT CONTEXT ---------------- */
  { id:'intctx', title:'Intelligent Context', icon:'flask-conical', steps:[
    { t:'concept', eyebrow:'The Testing Workspace',
      title:'Prototype search configs on sample content.',
      subtitle:'Try parsing methods, chunking, and extraction prompts — before committing to a full index.',
      ask:`Would you rather find out your parser is wrong now, or after building a 10M-chunk index?`,
      body:`<b>Intelligent Context</b> is an AI-powered sandbox where you upload a small set of sample docs and iterate on a search index configuration. You see the resulting chunks, confidence scores, and citations — and can adjust parsing, preprocessing, chunking, and embedding until it's right.<br><br>Think of it as the <b>REPL</b> for RAG. It sits at <b>Data Cloud → Process Content → Intelligent Context</b>.`,
    },
    { t:'concept', eyebrow:'Prerequisites',
      title:'What must be true in your org first.',
      subtitle:'IC piggybacks on Agentforce and Einstein.',
      ask:`Why does IC not appear in a fresh Data Cloud org?`,
      body:`Requirements:<br><br>• <b>Enable Agentforce</b> — IC uses generative AI features gated by Agentforce.<br>• <b>Turn on Einstein Generative AI</b> in Data 360.<br>• Permission set: <b>Data Cloud Architect</b>.<br><br><b>Caveat:</b> <b>Data Cloud One orgs do NOT support advanced processing using Intelligent Context.</b> If your org is Data Cloud One, IC is not available — you'll need to use Data Libraries or Easy Setup on search indexes instead.`,
    },
    { t:'concept', eyebrow:'Supported File Types',
      title:'Broader than Doc AI. Narrower than a full index.',
      subtitle:'8 formats, up to 5 documents per configuration.',
      ask:`If your source is a set of PowerPoints, does IC work?`,
      body:`IC accepts <b>8 file formats</b>:<br><br>• <b>Documents:</b> .pdf, .docx, .pptx, .txt<br>• <b>Web:</b> .html<br>• <b>Images:</b> .png, .jpg, .jpeg<br><br><b>Cap: 5 documents per configuration.</b> IC is deliberately a prototyping surface — you're not indexing a corpus here, you're testing a config on representative samples. Configurations <b>auto-save</b> as you work and appear in the list view.`,
    },
    { t:'concept', eyebrow:'The Smart Defaults Chat',
      title:'The primary UX is an agent chat, not a form.',
      subtitle:'You literally converse with an AI to build your configuration.',
      ask:`How does IC decide what parser and chunking to use for your first run?`,
      body:`After uploading files, IC drops you into an <b>agent chat window</b>. Click <b>"Set up my configuration using smart defaults"</b> and the agent proposes a full config: search type, parser, preprocessing, embedding model, chunking strategy.<br><br>You then either:<br>• <b>Accept</b> the smart defaults → jump straight to Test & Iterate<br>• <b>Modify</b> → open the Edit Configuration tab and hand-tune every knob<br><br>This is why IC feels different from creating a search index by form — the agent does the first pass for you.`,
    },
    { t:'concept', eyebrow:'What You Can Tune',
      title:'Every parsing / chunking knob from the rest of the course is exposed here.',
      subtitle:'IC is where the theory in M5 and M6 becomes tangible.',
      ask:`If Default Parser garbles a drivetrain spec table, what are your two upgrade paths?`,
      body:`Inside the Edit Configuration tab, IC exposes:<br><br>• <b>Search Index Type:</b> Vector or Hybrid<br>• <b>Parser:</b> Default / LLM-based / Docling<br>• <b>Preprocessing:</b> None / LLM-based preprocessing (mutually exclusive with LLM-based Parser)<br>• <b>Image Processing toggle:</b> Extract text from tables, forms, image captions<br>• <b>Embedding Model:</b> e5-large-v2, multilingual-e5-large, SFR-v2-small<br>• <b>Chunking Strategy:</b> Section-aware or Passage extraction, with Max Tokens and Overlap Tokens<br><br>Click <b>Apply Changes</b> and IC regenerates a new set of chunks in the Configuration Preview.`,
    },
    { t:'concept', eyebrow:'The Flagship Trick',
      title:'Fix a malformed table by ADDING A PROMPT.',
      subtitle:'This is the "aha moment" IC exists to enable.',
      ask:`Your chunks show a drivetrain spec table as a flattened wall of text. What do you do?`,
      body:`This is IC's signature workflow: instead of rebuilding the whole index, you <b>add a natural-language prompt</b> that instructs the LLM how to handle a specific extraction. From Salesforce's own docs:<br><br><i>"Fix extraction issues, such as a malformed table, by adding simple prompts without rebuilding the entire search index. For example: <b>'extract the drivetrain table as markdown'</b>."</i><br><br>You regenerate. The table now appears as markdown. Iterate until every problem chunk looks right. This is the loop that makes IC valuable — you avoid full rebuilds.`,
    },
    { t:'concept', eyebrow:'Confidence Scores & Citations',
      title:'Every chunk carries three affordances for debugging.',
      subtitle:'Not just "here is a chunk" — "here is how sure I am and where it came from".',
      ask:`How would you spot a chunk that IC extracted but is not confident about?`,
      body:`Every generated chunk in Intelligent Context shows:<br><br>• <b>Confidence score</b> — the model's self-reported certainty. Low scores are your first place to look.<br>• <b>Source file reference</b> — which document the chunk came from.<br>• <b>Citation</b> — the exact location (page, section) in the source.<br><br>Plus you get <b>search + filter</b> across all generated chunks, and clicking any chunk opens the source file in the preview pane.`,
    },
    { t:'concept', eyebrow:'Compare With Source',
      title:'Side-by-side chunks vs. original document.',
      subtitle:'The verification step you always wish you had for a real index.',
      ask:`How do you catch a chunk that quietly dropped a critical caveat from the source?`,
      body:`Click <b>Compare with Source</b> and IC opens a side-by-side view: generated chunks on one side, source document on the other. Scan for:<br><br>• Missing content that should have been extracted<br>• Chunks that split mid-sentence or mid-table<br>• Prepended metadata that isn't landing as expected<br><br>This is the manual audit step. Even with all the automation, one careful side-by-side pass on 5 sample docs catches issues you'd never see in production chunk counts.`,
    },
    { t:'concept', eyebrow:'Multi-Lens Configurations',
      title:'One doc → different views for different business functions.',
      subtitle:'Sales and Service can read the same product spec through different eyes.',
      ask:`A product spec has pricing AND troubleshooting steps. Should both go into one chunk set?`,
      body:`IC supports <b>multi-lens</b> extraction — write different prompts to pull different views from the same source content. Salesforce's canonical example:<br><br>• <b>Sales lens</b> — Extract competitive advantages, pricing structures, customer value propositions.<br>• <b>Service lens</b> — Extract support prerequisites, troubleshooting steps, maintenance guidelines.<br><br>Same product spec document. Two configurations. Two search indexes. Each team's agent sees the view most useful to them without wading through the other team's noise.`,
    },
    { t:'concept', eyebrow:'From Sandbox to Production',
      title:'The publish workflow: IC config → real search index.',
      subtitle:'You cannot publish until you have a real UDMO connector set up.',
      ask:`Why does clicking Publish sometimes throw "no UDMO available"?`,
      body:`Publishing an IC config is a 4-step promotion:<br><br>1. <b>Set up an unstructured data connector</b> ahead of time to ingest source files into a UDLO/UDMO. See <i>Unstructured Data File Formats and Connectors</i> for the connector list.<br>2. In IC, click <b>Publish</b>.<br>3. In the <b>Select an Unstructured Data Model Object</b> dialog, pick the UDMO your connector populates.<br>4. In <b>Create Search Index</b>, confirm the index name → Publish.<br><br>Now navigate to <b>Content Indexing</b> or <b>Search Index</b> to watch the index build. Your prototype config is now a real, production search index over the full corpus.`,
    },
    { t:'custom', eyebrow:'Simulated IC Workspace', icon:'flask-conical',
      title:'Iterate on a config the way IC does.',
      subtitle:'Change knobs → see the effect on a sample chunk. This mimics the IC feedback loop.',
      html:`
        <div class="card card--surface" style="padding:var(--space-4)">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);margin-bottom:var(--space-3)">
            <div>
              <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Parser</label>
              <select id="ic-parser" class="input" style="width:100%">
                <option value="default">Default</option>
                <option value="llm">LLM-based</option>
                <option value="docling">Docling</option>
              </select>
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Chunking</label>
              <select id="ic-chunk" class="input" style="width:100%">
                <option value="section">Section-aware</option>
                <option value="passage">Passage extraction</option>
              </select>
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Image Processing</label>
              <select id="ic-img" class="input" style="width:100%">
                <option value="off">Off</option>
                <option value="on">On</option>
              </select>
            </div>
            <div>
              <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px">Extraction Prompt</label>
              <input id="ic-prompt" class="input" type="text" placeholder='e.g. "extract the drivetrain table as markdown"' style="width:100%" />
            </div>
          </div>
          <button class="btn btn--primary btn--sm" id="ic-run"><i data-lucide="play"></i> Regenerate chunks</button>
          <div id="ic-out" style="margin-top:var(--space-3);padding:var(--space-3);background:var(--color-bg-subtle);border-radius:var(--radius-md);min-height:120px">
            <p style="color:var(--color-text-muted);margin:0">Pick your settings and click <b>Regenerate</b>.</p>
          </div>
        </div>`,
      init:function(node){
        const out = node.querySelector('#ic-out');
        node.querySelector('#ic-run').addEventListener('click', ()=>{
          const parser = node.querySelector('#ic-parser').value;
          const chunk = node.querySelector('#ic-chunk').value;
          const img = node.querySelector('#ic-img').value;
          const prompt = node.querySelector('#ic-prompt').value.trim();

          let table = 'Drivetrain Type | Torque | MPG\\nAWD | 320 lb-ft | 24\\nFWD | 250 lb-ft | 28';
          let tableStatus = 'good';
          if (parser === 'default') { table = 'Drivetrain Type Torque MPG AWD 320 lb-ft 24 FWD 250 lb-ft 28'; tableStatus = 'warn'; }
          if (parser === 'docling' || (parser === 'llm' && img === 'on')) {
            table = '| Drivetrain | Torque | MPG |\\n|---|---|---|\\n| AWD | 320 lb-ft | 24 |\\n| FWD | 250 lb-ft | 28 |';
            tableStatus = 'good';
          }
          if (prompt.toLowerCase().includes('markdown') && parser !== 'default') {
            table = '| Drivetrain | Torque | MPG |\\n|---|---|---|\\n| AWD | 320 lb-ft | 24 |\\n| FWD | 250 lb-ft | 28 |';
            tableStatus = 'good';
          }

          const chunkNote = chunk === 'section'
            ? 'Chunk boundaries follow H2 headings (Performance, Warranty, Options).'
            : 'Chunks split on semantic HTML tags — each <p> or <li> becomes its own chunk.';

          const conf = tableStatus === 'good' ? '0.94' : '0.62';
          const statusColor = tableStatus === 'good' ? '#10B981' : '#F59E0B';
          const statusIcon = tableStatus === 'good' ? 'check-circle-2' : 'alert-triangle';

          out.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <i data-lucide="${statusIcon}" style="color:${statusColor};width:16px;height:16px"></i>
              <b>Sample chunk from vehicle_spec.pdf, page 4</b>
              <span style="margin-left:auto;font-size:11px;padding:2px 6px;background:${statusColor}20;color:${statusColor};border-radius:4px;font-weight:600">confidence ${conf}</span>
            </div>
            <div style="font-family:var(--font-mono);font-size:12px;background:var(--color-bg-default);padding:10px;border-radius:6px;white-space:pre-wrap;border:1px solid var(--color-border-default)">${table}</div>
            <div style="margin-top:8px;font-size:12px;color:var(--color-text-muted)">${chunkNote}</div>
            ${tableStatus === 'warn' ? '<div style="margin-top:8px;font-size:12px;color:#F59E0B"><b>Hint:</b> table is flattened. Try Docling parser, or LLM parser + image processing, or add the prompt: <i>"extract the drivetrain table as markdown"</i>.</div>' : ''}
          `;
          if (window.lucide) lucide.createIcons();
        });
      },
      body:`This is the essential IC loop: change a knob → click regenerate → inspect chunks with confidence scores → adjust the prompt. Every parser combination behaves differently; the point is to <b>see</b> the difference before you commit to a full index.`,
    },
    { t:'quiz', eyebrow:'Concept Quiz', prompt:'A team keeps pushing Sales-lens and Service-lens changes into the same search index, then arguing over what to prioritize. What does IC do differently?',
      options:[
        {label:'IC supports multiple configurations from the same source — each publishes to its own search index, so Sales and Service each get a tailored index without conflict', correct:true, fb:'Correct. Multi-lens is a first-class pattern in IC: same docs, different prompts, different indexes.'},
        {label:'IC merges all extraction prompts into a single unified index', correct:false, fb:'That is the opposite of what IC does — it separates lenses into distinct configs and indexes.'},
        {label:'IC only lets one lens exist per source document', correct:false, fb:'IC explicitly supports multiple configurations per source. That is the whole "multi-lens" feature.'},
      ] },
    { t:'quiz', eyebrow:'Deployment Quiz', prompt:'You perfected an IC config on 5 sample product specs. You now want to run it on 40,000 spec docs in a shared drive. What must be true before you click Publish?',
      options:[
        {label:'A UDMO must already exist (via an unstructured data connector ingesting the shared drive) — IC publishes a config against a UDMO, not against a folder', correct:true, fb:'Correct. Publish requires selecting an existing UDMO. Set up the connector first, then publish.'},
        {label:'You need to enable Docling parser regardless of what you tested', correct:false, fb:'The parser is whatever you configured in IC — publish carries your choices over.'},
        {label:'You have to re-upload all 40,000 files into IC first', correct:false, fb:'You never upload the full corpus to IC. IC works on 5 sample docs; Publish applies the config to the UDMO with the full corpus.'},
      ] },
    { t:'quiz', eyebrow:'Availability Quiz', prompt:'Your org is a Data Cloud One org. What does that mean for Intelligent Context?',
      options:[
        {label:'Intelligent Context is NOT available on Data Cloud One — use Data Libraries or Easy Setup on search indexes instead', correct:true, fb:'Correct. This is an explicitly documented limitation.'},
        {label:'IC works normally on Data Cloud One', correct:false, fb:'It does not — Data Cloud One does not support advanced processing via Intelligent Context.'},
        {label:'IC works but requires an add-on license', correct:false, fb:'Not a licensing issue — it is unsupported on Data Cloud One.'},
      ] },
  ]},

  /* ================================================================
     PHASE 5 — MASTERY: Choose, Optimize, Troubleshoot
     ================================================================ */

  /* ---------------- M13. DECISION FRAMEWORK ---------------- */
  { id:'decisions', title:'Decision Framework', icon:'git-branch', steps:[
    { t:'concept', eyebrow:'The Real Skill',
      title:'Choose the right combination for your content.',
      subtitle:'Chunking × Parsing × Search Type × Enrichment — a matrix of choices.',
      ask:`Would the same setup work for HTML Knowledge, PDF manuals, and call transcripts?`,
      body:`Expert practitioners choose based on <b>content shape</b> and <b>query shape</b>. Below is a decision matrix you'll use on every project. Bookmark it.`,
    },
    { t:'custom', eyebrow:'Interactive Matrix', icon:'grid',
      title:'Pick your scenario, see the recommended stack.',
      subtitle:'Hover-tested by real project patterns.',
      html:`
        <div class="card card--surface" style="padding:var(--space-4);overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.9em">
            <thead>
              <tr style="text-align:left;border-bottom:2px solid var(--color-border)">
                <th style="padding:var(--space-2)">Scenario</th>
                <th style="padding:var(--space-2)">Parsing</th>
                <th style="padding:var(--space-2)">Chunking</th>
                <th style="padding:var(--space-2)">Search</th>
                <th style="padding:var(--space-2)">Enriched?</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--color-border)"><td style="padding:var(--space-2)">Salesforce Knowledge (HTML)</td><td>Default</td><td>Passage extraction</td><td>Hybrid</td><td>Optional</td></tr>
              <tr style="border-bottom:1px solid var(--color-border)"><td style="padding:var(--space-2)">Product manuals (PDF, tables)</td><td>Docling</td><td>Section-aware</td><td>Hybrid</td><td>No</td></tr>
              <tr style="border-bottom:1px solid var(--color-border)"><td style="padding:var(--space-2)">Call transcripts</td><td>Default</td><td>Conversation-based</td><td>Vector</td><td>No</td></tr>
              <tr style="border-bottom:1px solid var(--color-border)"><td style="padding:var(--space-2)">Q&A knowledge base</td><td>Default</td><td>Passage extraction</td><td>Hybrid</td><td><b>Yes</b></td></tr>
              <tr style="border-bottom:1px solid var(--color-border)"><td style="padding:var(--space-2)">Multilingual FAQs</td><td>Default</td><td>Section-aware</td><td>Vector (multilingual model)</td><td>Yes</td></tr>
              <tr><td style="padding:var(--space-2)">Invoices (extract fields)</td><td colspan="4"><b>Use Document AI, not a search index</b></td></tr>
            </tbody>
          </table>
        </div>`,
      init:function(node){},
      body:`Rules of thumb:<br>• Complex visuals? → Docling parser.<br>• Q&A workload? → Enrich.<br>• Domain jargon or IDs? → Hybrid.<br>• Multi-language? → Multilingual embedding + vector-only if hybrid mixes languages.<br>• Structured extraction? → Document AI, not RAG.`,
    },
    { t:'quiz', eyebrow:'Scenario Quiz', prompt:'A team wants their agent to answer "how do I..." questions from a knowledge base of 5000 articles. Best stack?',
      options:[
        {label:'Default parser, passage extraction chunking, hybrid search, enriched indexing ON', correct:true, fb:'Correct. Clean HTML → default parser. Q&A workload → enrich. Domain terms → hybrid.'},
        {label:'Docling parser, conversation-based chunking, vector-only search, no enrichment', correct:false, fb:'Docling is overkill for clean HTML; conversation-based doesn\'t fit articles; you\'d miss the Q&A boost from enrichment.'},
        {label:'Document AI', correct:false, fb:'Document AI extracts fields. This is a retrieval workload, not an extraction one.'},
      ] },
  ]},

  /* ---------------- M14. COST & BILLING ---------------- */
  { id:'cost', title:'Cost & Billing', icon:'wallet', steps:[
    { t:'concept', eyebrow:'The Digital Wallet',
      title:'One place to see all your consumption.',
      subtitle:'Two consumption cards: Data Services + Flex Credits.',
      ask:`Where would you go in Setup to see how much Data Cloud is costing you?`,
      body:`The <b>Digital Wallet</b> in Setup shows all consumption in one place. Two cards matter for unstructured data:<br><br>• <b>Data Services card</b> — meters storage, ingestion, processing, and queries<br>• <b>Flex Credits card</b> — meters LLM usage (prompts, enrichment)<br><br>Check both after any pipeline change to see the true impact.`,
    },
    { t:'concept', eyebrow:'Four Data Services Usage Types',
      title:'What each usage type meters.',
      subtitle:'Unstructured Data Processed, Intelligent Processing, Data Queries, Storage Beyond Allocation.',
      ask:`If you enable Docling on 10 GB of PDFs, which usage type spikes?`,
      body:`<ul style="margin-left:var(--space-4); margin-top:var(--space-2)">
        <li><b>Unstructured Data Processed</b> — default parsing, chunking, vectorization. Charged per MB processed.</li>
        <li><b>Intelligent Processing</b> — LLM parsing, Docling image processing, Intelligent Context. Higher-tier meter.</li>
        <li><b>Data Queries</b> — charged per records processed in vector/hybrid search. Runtime cost.</li>
        <li><b>Storage Beyond Allocation</b> — MB stored in Chunk/Index DMOs and UDLOs past your entitlement.</li>
      </ul>`,
    },
    { t:'concept', eyebrow:'Flex Credit Tiers',
      title:'Standard, Basic, Advanced Prompts.',
      subtitle:'2,000 tokens = 1 billing unit. Rounds up.',
      ask:`Why does enrichment cost more than a simple retrieval?`,
      body:`Flex Credits meter LLM usage in three tiers:<br><br>• <b>Standard Prompts</b> — cheap models, 4 Flex Credits per unit (example rate)<br>• <b>Basic Prompts</b> — mid-tier reasoning<br>• <b>Advanced Prompts</b> — top-tier LLMs used for enrichment and complex reasoning<br><br><b>Billing unit: 2,000 tokens = 1 unit (rounds up).</b><br>Enrichment (LLM parsing, question/metadata generation) uses Advanced Prompts and metering begins <b>July 21, 2026</b>.<br><br><b>Einstein Requests credits are consumed FIRST</b>, then Flex Credits.`,
    },
    { t:'concept', eyebrow:'License Considerations',
      title:'Some editions are unmetered.',
      subtitle:'Agentforce 1 Edition and Data 360 Profiles license.',
      ask:`Would a Data 360 Profiles customer see Data Services charges for vectorization?`,
      body:`Certain licenses are unmetered for specific usage types:<br>• <b>Agentforce 1 Edition</b> — includes many Data Services usage types<br>• <b>Data 360 Profiles license</b> — includes Unstructured Data Processed<br><br>Always check your entitlement before assuming cost. The Digital Wallet card will show "included" vs "billed" clearly.`,
    },
    { t:'concept', eyebrow:'Cost Levers',
      title:'Four ways to reduce spend without losing quality.',
      subtitle:'Small choices compound.',
      ask:`If cost is high but quality is fine, where do you cut first?`,
      body:`<ol style="margin-left:var(--space-4)">
        <li><b>Use default parser</b> where you can — it's free vs. Docling.</li>
        <li><b>Skip enrichment</b> when baseline retrieval already works.</li>
        <li><b>Compress inputs</b> — smaller PDFs = fewer stored MB.</li>
        <li><b>Batch reindex</b> intelligently — don't re-embed unchanged content.</li>
      </ol>`,
    },
    { t:'concept', eyebrow:'The Refresh Trap',
      title:'Every re-index is a new bill.',
      subtitle:'Plan refresh cadence carefully.',
      ask:`If your source updates hourly, should you re-embed everything hourly?`,
      body:`Data Cloud re-embeds only <b>changed</b> chunks by default, but full-refresh triggers everything. If your source publishes frequently, use incremental refreshes and set schedules that match business need — not raw update frequency.`,
    },
    { t:'quiz', eyebrow:'Quick Check', prompt:'You enable enriched indexing on 1M chunks. Roughly how many chunks will your index hold?',
      options:[
        {label:'~3M — enrichment creates plain + metadata + question chunks per original', correct:true, fb:'Correct. Plan storage and LLM cost accordingly.'},
        {label:'~1M — enrichment adds metadata to the same chunks', correct:false, fb:'No. Enrichment produces new chunks alongside the originals, roughly tripling the count.'},
        {label:'~10M — enrichment adds 10 questions per chunk', correct:false, fb:'The count is roughly 3x, not 10x.'},
      ] },
  ]},

  /* ---------------- M15. TROUBLESHOOTING ---------------- */
  { id:'troubleshoot', title:'Troubleshooting', icon:'stethoscope', steps:[
    { t:'concept', eyebrow:'Think Like A Doctor',
      title:'RAG problems have layers. Diagnose top-down.',
      subtitle:'Agent output → retriever → index → chunks → source.',
      ask:`Your agent gives a wrong answer. Where do you look first?`,
      body:`Walk the pipeline in reverse:<br><br>1. <b>Agent layer:</b> Is it using the retriever? Is the prompt template correct?<br>2. <b>Retriever:</b> Does the Playground return the right chunks for the query?<br>3. <b>Index:</b> Are the right chunks even in there?<br>4. <b>Chunks:</b> Query the Chunk DMO — is the source text accurate and coherent?<br>5. <b>Source:</b> Is the original document correct?<br><br>Fix at the lowest layer that's broken.`,
    },
    { t:'custom', eyebrow:'Troubleshooting Playbook', icon:'clipboard-list',
      title:'Common failure modes and fixes.',
      subtitle:'Click a symptom to see the diagnostic path.',
      html:`
        <div class="card card--surface" style="padding:var(--space-4)">
          <div id="ts-buttons" style="display:flex;flex-wrap:wrap;gap:var(--space-2);margin-bottom:var(--space-3)">
            <button class="btn btn--secondary btn--sm" data-ts="0">Wrong answer</button>
            <button class="btn btn--secondary btn--sm" data-ts="1">Chunks too small/large</button>
            <button class="btn btn--secondary btn--sm" data-ts="2">Table data garbled</button>
            <button class="btn btn--secondary btn--sm" data-ts="3">High cost</button>
            <button class="btn btn--secondary btn--sm" data-ts="4">Multilingual failing</button>
          </div>
          <div id="ts-detail" style="padding:var(--space-3);background:var(--color-bg-subtle);border-radius:var(--radius-md);min-height:120px">
            <p style="color:var(--color-text-muted)">Pick a symptom above.</p>
          </div>
        </div>`,
      init:function(node){
        const items = [
          { title:'Symptom: Agent returns wrong answer', body:`<b>Check:</b> Open Retriever Playground. Run the exact user query. Are the right chunks in the top-K?<br><br><b>If yes:</b> Fix the prompt template — instructions or citation format are off.<br><b>If no:</b> Adjust chunking, add prepend fields, or enable enriched indexing so the right chunks match.` },
          { title:'Symptom: Chunks are too small or too big', body:`<b>Check:</b> Query the Chunk DMO. Look at token counts and content.<br><br><b>Fix:</b> Tune <code>max_tokens</code> and <code>overlap_tokens</code>. Switch to section-aware chunking if content has clear headings. For CJK languages, lower max_tokens to 300–400.` },
          { title:'Symptom: Table data is garbled', body:`<b>Check:</b> Look at one chunk that contains table data. Is it plain flattened text?<br><br><b>Fix:</b> Switch parser to <b>Docling</b>. Docling preserves tables as markdown, so chunks retain structure.` },
          { title:'Symptom: Credit consumption is too high', body:`<b>Check:</b> Are you using LLM-based parsing/preprocessing everywhere? Do you have enrichment enabled on content that doesn\'t need it?<br><br><b>Fix:</b> Use default parser where possible. Turn off enrichment for identifier-lookup content. Batch refreshes.` },
          { title:'Symptom: Multilingual queries return poor results', body:`<b>Check:</b> Which embedding model is your index using?<br><br><b>Fix:</b> Switch to <b>multilingual-e5-large</b> or an equivalent multilingual model. Consider vector-only search when hybrid mixes languages inconsistently.` },
        ];
        const detail = node.querySelector('#ts-detail');
        node.querySelectorAll('[data-ts]').forEach(btn => {
          btn.addEventListener('click', () => {
            const i = parseInt(btn.getAttribute('data-ts'));
            const s = items[i];
            detail.innerHTML = `<h4 style="margin:0 0 var(--space-2)">${s.title}</h4><p style="margin:0">${s.body}</p>`;
          });
        });
      },
      body:`The <b>Retriever Playground</b> is your best friend. If the right chunk isn't there, nothing downstream can save you.`,
    },
    { t:'concept', eyebrow:'Search Index Status States',
      title:'Four states you will see.',
      subtitle:'Submitted → In-Progress → Ready or Failed.',
      ask:`Your index sits at "In-Progress" for hours. Is that normal?`,
      body:`Search index lifecycle states:<br><br>• <b>Submitted</b> — job accepted, not yet started<br>• <b>In-Progress</b> — chunking, parsing, embedding running<br>• <b>Ready</b> — index is live; incremental processing takes over for new/changed records<br>• <b>Failed</b> — investigate via Process History (retains up to <b>1,000 recent jobs</b>)<br><br>Large indexes can legitimately take hours. Check Process History for stall vs progress.`,
    },
    { t:'concept', eyebrow:'Skipped Record Reasons',
      title:'Why some source records never made it in.',
      subtitle:'Four common causes.',
      ask:`Your source has 10,000 records but the index has 8,700 chunks. Where did the missing 1,300 go?`,
      body:`Process History shows a "Skipped" count per job. Common reasons:<br><br>• File type doesn't match config<br>• Auth errors in data source<br>• File size exceeds limit (4 MB text/HTML, 100 MB PDF)<br>• Unsupported file format<br><br>Also watch for: <b>UTF-8 only</b> (non-UTF-8 files silently drop), <b>no namespaces in Dev Edition</b>, and <b>no date/datetime fields</b> allowed as chunking source.`,
    },
    { t:'quiz', eyebrow:'Scenario Quiz', prompt:'An agent gives a subtly-wrong answer. The Retriever Playground shows the correct chunk is in position #1. Where do you look next?',
      options:[
        {label:'The prompt template — the LLM is receiving the right context but interpreting it wrong', correct:true, fb:'Correct. If retrieval is right and generation is wrong, the fix is upstream in the prompt or downstream in model choice.'},
        {label:'The chunking strategy', correct:false, fb:'Chunking is fine — the right chunk is being retrieved. Look at the prompt.'},
        {label:'The embedding model', correct:false, fb:'Embeddings are fine — semantic matching succeeded. Look at the prompt.'},
      ] },
  ]},

  /* ---------------- M16. OPTIMIZATION PATTERNS ---------------- */
  { id:'optimize', title:'Optimization Patterns', icon:'gauge', steps:[
    { t:'concept', eyebrow:'Iterate With Data',
      title:'RAG is not "build once and ship".',
      subtitle:'Measure retrieval quality. Iterate. Measure again.',
      ask:`How do you know your retrieval improved without running real user queries?`,
      body:`Build a <b>golden set</b> of 30–100 real user queries paired with the ideal chunk(s). Re-run this set after every change. Track:<br>• <b>Recall@K:</b> Is the right chunk in the top-K?<br>• <b>MRR:</b> How high does it rank?<br>• <b>User feedback:</b> Thumbs up/down on agent responses.<br><br>Optimize what you measure.`,
    },
    { t:'concept', eyebrow:'The Optimization Loop',
      title:'Six levers, tried in order of ROI.',
      subtitle:'Start cheap. Get expensive only if you must.',
      ask:`If your recall@5 is 60%, what should you try first?`,
      body:`<ol style="margin-left:var(--space-4)">
        <li><b>Prepend fields</b> — free context boost.</li>
        <li><b>Switch to hybrid</b> if pure vector is missing keyword matches.</li>
        <li><b>Tune chunking</b> — max_tokens, overlap, strategy.</li>
        <li><b>Enable enriched indexing</b> — big lift on Q&A workloads.</li>
        <li><b>Try DFR fusion</b> — replaces RRF for higher accuracy at cost.</li>
        <li><b>Change embedding model</b> — last resort; requires full reindex.</li>
      </ol>`,
    },
    { t:'concept', eyebrow:'When To Stop',
      title:'Diminishing returns are real.',
      subtitle:'Ship at 80% recall and improve based on production signals.',
      ask:`Is chasing 95% recall in a dev environment worth the delay?`,
      body:`Perfect retrieval is a moving target. Ship when:<br>• Your golden set hits acceptable recall (usually 80%+).<br>• User feedback is majority positive.<br>• Cost is within budget.<br><br>Post-launch, add production queries to your golden set and iterate. You'll learn more from 1 week of real traffic than 3 months of offline tuning.`,
    },
    { t:'quiz', eyebrow:'Quick Check', prompt:'Which optimization has the LOWEST cost and often meaningful impact?',
      options:[
        {label:'Adding prepend fields (title, product) to chunks', correct:true, fb:'Correct. Prepending is essentially free and often lifts recall on ambiguous chunks by 5–15%.'},
        {label:'Switching embedding models', correct:false, fb:'That requires a full reindex — high cost. Save for last.'},
        {label:'Enabling enriched indexing', correct:false, fb:'Enrichment has high ongoing cost (3x chunks, LLM calls). Try prepending first.'},
      ] },
  ]},

  /* ---------------- M17. CAPSTONE ---------------- */
  { id:'capstone', title:'Capstone Project', icon:'trophy', steps:[
    { t:'concept', eyebrow:'Put It All Together',
      title:'You now have the full mental model.',
      subtitle:'Design a production RAG solution end-to-end.',
      ask:`Imagine: a support org with 20K Knowledge articles, product manuals as PDFs, and call transcripts. What's your stack?`,
      body:`Walk through the decisions on the next screen — the "shape" of your answer should feel obvious now.`,
    },
    { t:'custom', eyebrow:'Design Challenge', icon:'notebook-pen',
      title:'Sketch a solution. Reveal the reference answer.',
      subtitle:'No wrong answers — just tradeoffs.',
      html:`
        <div class="card card--surface" style="padding:var(--space-4)">
          <p><b>Scenario:</b> A B2B software company wants its Agentforce agent to answer customer questions using: (a) 20K Knowledge articles (HTML), (b) 500 PDF product manuals with tables and diagrams, (c) 100K call transcripts.</p>
          <p style="margin-top:var(--space-3)"><b>Design questions:</b></p>
          <ol style="margin-left:var(--space-4)">
            <li>One search index or three? Why?</li>
            <li>Parser choice for each source?</li>
            <li>Chunking strategy for each?</li>
            <li>Vector or hybrid?</li>
            <li>Enrichment: on or off?</li>
            <li>How many retrievers?</li>
          </ol>
          <button class="btn btn--primary btn--sm" id="cs-reveal" style="margin-top:var(--space-3)"><i data-lucide="eye"></i> Reveal reference design</button>
          <div id="cs-answer" style="margin-top:var(--space-3);display:none">
            <ul class="fb-list">
              <li class="fb good"><i data-lucide="check"></i><span><b>Three indexes.</b> Different content shapes and query patterns — keep them separate for tuning.</span></li>
              <li class="fb good"><i data-lucide="check"></i><span><b>Parser:</b> Default for Knowledge and transcripts. Docling for PDF manuals (tables, diagrams).</span></li>
              <li class="fb good"><i data-lucide="check"></i><span><b>Chunking:</b> Passage extraction for Knowledge; section-aware for manuals; conversation-based for transcripts.</span></li>
              <li class="fb good"><i data-lucide="check"></i><span><b>Search:</b> Hybrid for Knowledge and manuals (product terms matter); vector-only for transcripts (freeform speech).</span></li>
              <li class="fb good"><i data-lucide="check"></i><span><b>Enrichment:</b> ON for Knowledge and manuals (Q&A workload). OFF for transcripts (too expensive at scale).</span></li>
              <li class="fb good"><i data-lucide="check"></i><span><b>Retrievers:</b> At least 3 (one per index), potentially more if you need filtered variants (customer-facing vs internal).</span></li>
            </ul>
          </div>
        </div>`,
      init:function(node){
        const btn = node.querySelector('#cs-reveal');
        const ans = node.querySelector('#cs-answer');
        btn.addEventListener('click', () => {
          ans.style.display = 'block';
          btn.style.display = 'none';
          if(window.lucide) lucide.createIcons();
        });
      },
      body:`If you can defend each choice with tradeoffs (cost, quality, complexity), you are operating as an expert.`,
    },
    { t:'concept', eyebrow:'What Comes Next',
      title:'You did it. Zero → Expert.',
      subtitle:'You have a full mental model of Salesforce unstructured data processing.',
      ask:`What will you build first?`,
      body:`You can now:<br>✓ Explain RAG to any stakeholder<br>✓ Choose chunking, parsing, and search strategies for any content<br>✓ Build search indexes and retrievers by hand or via Data Libraries<br>✓ Use Document AI for structured extraction<br>✓ Prototype in Intelligent Context<br>✓ Estimate cost and choose optimizations by ROI<br>✓ Troubleshoot RAG systematically<br><br><b>Next:</b> Open a Developer org, build a Data Library, connect it to an agent, and iterate on a real problem. Everything else is repetition.`,
    },
    { t:'quiz', eyebrow:'Final Check', prompt:'What is the single most important tool for debugging RAG?',
      options:[
        {label:'The Retriever Playground — it shows whether the right chunks are being retrieved for a query', correct:true, fb:'Correct. Retrieval is the choke point. If it\'s wrong there, nothing downstream can fix it.'},
        {label:'The LLM prompt editor', correct:false, fb:'Important, but only relevant when retrieval is already correct.'},
        {label:'The billing dashboard', correct:false, fb:'Useful for cost, not correctness.'},
      ] },
  ]},

];

// Engine compatibility — keep these two lines at the end.
const COL_TYPES = ['text','integer','decimal','boolean','date','timestamp','uuid','id'];
const CHALLENGES = [];

// expose for Learning OS concept-map (loaded as a plain script before app.js)
window.MODULES = MODULES;
