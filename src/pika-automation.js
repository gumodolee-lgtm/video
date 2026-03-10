const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class PikaAutomation {
  constructor() {
    this.browser = null;
    this.page = null;
    this.videoPlan = null;
  }

  async init() {
    console.log('🚀 Pika.art 자동화 스크립트 시작');
    
    // video-plan.json 로드
    const videoPlanPath = path.join(__dirname, '..', 'prompts', 'video-plan.json');
    if (!fs.existsSync(videoPlanPath)) {
      throw new Error('video-plan.json 파일을 찾을 수 없습니다');
    }
    
    this.videoPlan = JSON.parse(fs.readFileSync(videoPlanPath, 'utf8'));
    console.log(`📋 ${this.videoPlan.scenes.length}개의 씬을 찾았습니다`);
  }

  async launchBrowser() {
    console.log('🌐 브라우저 시작 중...');
    this.browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    this.page = await this.browser.newPage();
    
    // 뷰포트 설정 (9:16 비율에 맞게)
    await this.page.setViewport({ width: 450, height: 800 });
    
    console.log('✅ 브라우저가 성공적으로 시작되었습니다');
  }

  async openPika() {
    console.log('🎯 Pika.art 웹사이트 열기...');
    await this.page.goto('https://pika.art', { waitUntil: 'networkidle2' });
    
    // 로그인 상태 확인
    await this.page.waitForSelector('body', { timeout: 10000 });
    console.log('✅ Pika.art에 접속했습니다');
  }

  generatePikaPrompt(scene) {
    // Pika 프롬프트 생성: [description] -camera [camera_movement] -motion 2
    const prompt = `${scene.description} -camera ${scene.camera_movement} -motion 2`;
    console.log(`📝 생성된 프롬프트: ${prompt}`);
    return prompt;
  }

  async generateVideo(scene) {
    const prompt = this.generatePikaPrompt(scene);
    const outputPath = path.join(__dirname, '..', 'output', 'videos', `scene-${scene.id}.mp4`);
    
    console.log(`🎬 씬 ${scene.id} 영상 생성 시작 (예상 시간: ${scene.duration}초)`);
    
    try {
      // 1. 프롬프트 입력 - 다양한 셀렉터 시도
      console.log('📝 프롬프트 입력란 찾는 중...');
      const selectors = [
        'textarea[placeholder*="Describe your video"]',
        'textarea[placeholder*="Describe"]',
        'textarea[placeholder*="Prompt"]',
        'textarea[placeholder*="prompt"]',
        'input[placeholder*="Describe your video"]',
        'input[placeholder*="Describe"]',
        'input[placeholder*="Prompt"]',
        'textarea',
        'input[type="text"]',
        '[contenteditable="true"]',
        '[data-testid*="prompt"]',
        '[class*="prompt"]',
        '[id*="prompt"]'
      ];
      
      let promptElement = null;
      for (const selector of selectors) {
        try {
          promptElement = await this.page.waitForSelector(selector, { timeout: 3000 });
          if (promptElement) {
            console.log(`✅ 프롬프트 입력란 발견: ${selector}`);
            break;
          }
        } catch (e) {
          // 다음 셀렉터 시도
        }
      }
      
      if (!promptElement) {
        throw new Error('프롬프트 입력란을 찾을 수 없습니다');
      }
      
      await promptElement.type(prompt);
      
      // 2. Aspect Ratio 설정 (9:16) - 다양한 셀렉터 시도
      console.log('🎬 Aspect Ratio 설정 중...');
      const aspectSelectors = [
        'button[aria-label*="Aspect Ratio"]',
        'button[data-value="9:16"]',
        'button[aria-label*="9:16"]',
        'button[aria-label*="Aspect"]',
        'button[class*="aspect"]',
        'button[data-testid*="aspect"]',
        'button'
      ];
      
      for (const selector of aspectSelectors) {
        try {
          await this.page.click(selector, { timeout: 2000 });
          console.log(`✅ Aspect Ratio 버튼 클릭: ${selector}`);
          break;
        } catch (e) {
          // 다음 셀렉터 시도
        }
      }
      
      // 9:16 옵션 선택 시도
      try {
        await this.page.click('button[data-value="9:16"]', { timeout: 2000 });
        console.log('✅ 9:16 비율 선택');
      } catch (e) {
        console.log('⚠️ 9:16 비율 선택 실패 (무시)');
      }
      
      // 3. Duration 설정 - 다양한 셀렉터 시도
      console.log('⏱️ Duration 설정 중...');
      const durationSelectors = [
        'button[aria-label*="Duration"]',
        'button[aria-label*="Time"]',
        'button[aria-label*="Length"]',
        'button[data-testid*="duration"]',
        'button[class*="duration"]',
        'button'
      ];
      
      for (const selector of durationSelectors) {
        try {
          await this.page.click(selector, { timeout: 2000 });
          console.log(`✅ Duration 버튼 클릭: ${selector}`);
          break;
        } catch (e) {
          // 다음 셀렉터 시도
        }
      }
      
      // 4. Generate 버튼 클릭 - 다양한 셀렉터 시도
      console.log('🚀 Generate 버튼 클릭 중...');
      const generateSelectors = [
        'button[type="submit"]',
        'button[aria-label*="Generate"]',
        'button[data-testid*="generate"]',
        'button[class*="generate"]',
        'button',
        'button[aria-label*="Create"]',
        'button[aria-label*="Start"]'
      ];
      
      let generateClicked = false;
      for (const selector of generateSelectors) {
        try {
          await this.page.click(selector, { timeout: 2000 });
          console.log(`✅ Generate 버튼 클릭: ${selector}`);
          generateClicked = true;
          break;
        } catch (e) {
          // 다음 셀렉터 시도
        }
      }
      
      if (!generateClicked) {
        throw new Error('Generate 버튼을 찾을 수 없습니다');
      }
      
      // 5. 생성 완료 대기
      console.log('⏳ 영상 생성 중... 잠시 기다려 주세요');
      await this.waitForGeneration();
      
      // 6. 다운로드
      await this.downloadVideo(outputPath);
      
      console.log(`✅ 씬 ${scene.id} 영상 다운로드 완료: ${outputPath}`);
      return true;
      
    } catch (error) {
      console.error(`❌ 씬 ${scene.id} 생성 실패:`, error.message);
      return false;
    }
  }

  async waitForGeneration() {
    // 생성 상태 확인 로직
    await this.page.waitForFunction(() => {
      const statusElement = document.querySelector('[data-testid="generation-status"]');
      return statusElement && statusElement.textContent.includes('Complete');
    }, { timeout: 120000 });
  }

  async downloadVideo(outputPath) {
    // 다운로드 버튼 클릭 및 파일 저장 로직
    await this.page.click('button[aria-label*="Download"]', { timeout: 5000 });
    
    // 파일 다운로드 대기
    await this.page.waitForFunction(() => {
      const downloadLink = document.querySelector('a[href*=".mp4"]');
      return downloadLink !== null;
    }, { timeout: 30000 });
    
    // 파일 저장
    const downloadUrl = await this.page.evaluate(() => {
      const link = document.querySelector('a[href*=".mp4"]');
      return link.href;
    });
    
    const response = await fetch(downloadUrl);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buffer));
  }

  async run() {
    try {
      await this.init();
      await this.launchBrowser();
      await this.openPika();
      
      // 출력 디렉토리 생성
      const outputDir = path.join(__dirname, '..', 'output', 'videos');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      let successCount = 0;
      
      // 각 씬 처리
      for (const scene of this.videoPlan.scenes) {
        const success = await this.generateVideo(scene);
        if (success) {
          successCount++;
        } else {
          console.log(`⚠️ 씬 ${scene.id} 생성에 실패했습니다`);
        }
        
        // 다음 씬을 위해 잠시 대기
        await this.page.waitForTimeout(2000);
      }
      
      console.log(`\n🎉 작업 완료! 성공한 영상: ${successCount}/${this.videoPlan.scenes.length}`);
      
      if (successCount === this.videoPlan.scenes.length) {
        console.log('✅ 모든 영상 다운로드 완료!');
      } else {
        console.log('⚠️ 일부 영상 생성에 실패했습니다');
      }
      
    } catch (error) {
      console.error('❌ 작업 중 오류 발생:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// 스크립트 실행
if (require.main === module) {
  const automation = new PikaAutomation();
  automation.run().catch(console.error);
}

module.exports = PikaAutomation;